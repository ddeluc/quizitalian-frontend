import React, { useState, useRef } from 'react';


import {
  Paper,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Box,
  ThemeProvider,
  createTheme,
  getAppBarUtilityClass,
} from '@mui/material';


import * as api from '../../api/index.jsx';

import translate from 'translate';

translate.engine = 'deepl';
const DEEPL_KEY = 'a6353ea4-0481-de0d-39d9-46e8254a53ce';
translate.key = DEEPL_KEY;

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5"
    },
    background: {
      default: "#eeeeee"
    }
  }
});

function CreateModule({ addModule, user }) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  // Create a flashcard
  const translateCards = async (terms) => {
    const cards = [];

    for (let i = 0; i < terms.length; i++) {
      const translation = await translate(terms[i], { from: 'it', to: 'en' });
      const card = { index: i+1, original: terms[i], translation: translation};
      cards.push(card);
    }

    return cards;
  };

  const createVerbHelper = (token1, token2) => {
    console.log(token1);
    console.log(token2);
    let helper = [];
    let compoundForm = 'unknown';

    if (token1.features.VerbForm[0] == 'Fin') {
      const tense = token1.features.Tense[0];
      const mood = token1.features.Mood[0];

      switch (mood) {
        case ('Ind'):              
          if (tense == 'Pres') {
            compoundForm = "Passato Prossimo";
          } else if (tense == 'Past') {
            compoundForm = "Trapassato Remoto";
          } else if (tense == 'Imp') {
            compoundForm = "Trapassato Prossimo";
          } else if (tense == 'Fut') {
            compoundForm = "Futuro Anteriore";
          };
          break;
        case ('Sub'):
          if (tense == 'Pres') {
            compoundForm = "Congiuntivo Passato";
          } else if (tense == 'Imp') {
            compoundForm = "Congiuntivo Trapassato";
          };
          break;
        case ('Cnd'):
          if (tense == 'Pres') {
            compoundForm = "Condizionale Passato";
          };
          break;
      }

      helper = [compoundForm, token1.features.Person[0], token1.features.Number[0]]
      // helper = compoundForm + ". " + token1.features.Person[0] + " " + token1.features.Number[0];
    } else if (token1.features.VerbForm[0] == 'Ger') {
      helper = ["GERUNDIO"]
      // helper = "Gerundio";
    }

    // return helper + " " + token2.lemma;
    console.log(helper);
    helper.push(token2.lemma)
    return helper;
  };

  const addVerbHelpers = (sentences) => {
    sentences.forEach((sentence) => {
      sentence.verbs.forEach((verb) => {
        sentence.tokens[verb.tokens[0] - 1].helper = true;
        if (verb.tokens.length == 2) {          
          if (sentence.tokens[verb.tokens[0] - 1].pos == 'VA') {
            const auxiliary = sentence.tokens[verb.tokens[0] - 1];            
            const participle = sentence.tokens[verb.tokens[1] - 1];
            auxiliary.helper = createVerbHelper(auxiliary, participle);
            auxiliary.helper.push('AUX');
            participle.helper = createVerbHelper(auxiliary, participle);
            participle.helper.push('PART');
          }      
        } else {
          const infinitive = sentence.tokens[verb.tokens[0] - 1];
          if (infinitive.isMultiwordToken) {
            const pronoun = sentence.tokens[verb.tokens[0]];
            // infinitive.helper = infinitive.lemma + " + " + pronoun.lemma;        
            infinitive.helper = [infinitive.lemma, pronoun.lemma];    
          } else {                      
            const mood = infinitive.features.Mood ? infinitive.features.Mood[0] : null;
            const tense = infinitive.features.Tense ? infinitive.features.Tense[0] : null;
            const person = infinitive.features.Person ? infinitive.features.Person[0] : null;
            const number = infinitive.features.Number ? infinitive.features.Number[0] : null;
            // infinitive.helper = mood + tense + person + number + infinitive.lemma;
            infinitive.helper = [mood, tense, person, number]
          }          
        }
      })
    })
  }

  const preprocessSentences = async (sentences) => {
    // Create preposition cards
    // Create noun cards
    // Create verb cards
    // Create adjective cards
    const prepositionTerms = [];
    const nounTerms = [];
    const adjectiveTerms = [];
    const infinitiveTerms = [];
    const textList = [];

    sentences.forEach((sentence) => {
      let prepCheck = false;
      let prepCard = [];
      sentence.tokens.forEach((token) => {
        if (token.pos == 'E') {
          prepCheck = true;
        }

        // Add the helper field for verbs
        token.helper = [];

        // Add infinitives
        if (token.ud_pos == 'VERB' && !infinitiveTerms.includes(token.lemma)) {
          infinitiveTerms.push(token.lemma)
        }

        // Add each element
        if (textList.length == 0 || textList[textList.length-1] != token.originalText)
          textList.push(token.originalText);

        // Add preposition
        if (prepCheck) {
          if (token.isMultiwordToken) {
            if (token.isMultiwordFirstToken) {
                prepCard.push(token.originalText);
            }
          } else {
            prepCard.push(token.originalText);                        
          }

          if (token.pos == 'S' || token.pos == 'SP' || token.pos == 'V') {
            prepCheck = false;
            let prepTerm = "";
            prepCard.forEach((e) => {
              prepTerm = prepTerm + e + " "
            })
            prepositionTerms.push(prepTerm);
            prepCard = [];
          }                        
        }

        // Add noun
        if (token.pos == 'S' && !nounTerms.includes(token.originalText)) {            
          nounTerms.push(token.originalText);
        }

        // Add adjective
        if (token.pos == 'A' && !adjectiveTerms.includes(token.originalText)) {
          adjectiveTerms.push(token.originalText);
        }
      })
    })

    addVerbHelpers(sentences);

    const prepositionCards = await translateCards(prepositionTerms);
    const nounCards = await translateCards(nounTerms);
    const adjectiveCards = await translateCards(adjectiveTerms);
    const infinitiveCards = await translateCards(infinitiveTerms);

    return {
      cards: {
        prepositions: prepositionCards,
        nouns: nounCards,
        adjectives: adjectiveCards,
        infinitives: infinitiveCards,
      },
      textList: textList,
      verbList: infinitiveTerms,
    }    
  }

  // Create a module
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Set loading circle
      setLoading(true);
      let text = e.target.text.value;
      let title = e.target.title.value;

      // Automatically use default text upon empty input
      if (!text) {
        text = `All'improviso mi è scattato qualcosa nella testa e ho pensato: "A me piace farlo". E in quel preciso istante ho scoperto una libertà che non posedevo prima.`;
      }

      // Automatically use default title upon empty input
      if (!title) {
        title = `Module${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
      }

      // Get Tint data
      const tintData = await api.tintRequest(text); 
      console.log(tintData);     

      // Get all sentences: sentence: { tokens: [], verbs: []}
      const sentences = tintData.data.sentences;

      const preprocessedData = await preprocessSentences(sentences);
      console.log(preprocessedData)
      
      const sendDataModule = {
        title: title,
        text: text,
        author: user.username,
        cards: preprocessedData.cards,
        textList: preprocessedData.textList,
        verbList: preprocessedData.verbList,
        sentences: sentences,
      };

      console.log(sendDataModule);

      const { data } = await api.createModule(sendDataModule);

      addModule(data, false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  return (
    <>
      <div className="border text-3xl">
        <input className="w-full">

        </input>
      </div>
      <div className="flex border flex-wrap">          
        <textarea className='w-full h-72 resize-none'>

        </textarea>
      </div>
    </>
  )

  return (
    <ThemeProvider theme={theme}>
      { (loading)
        ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        )
        : (
          <Paper sx={{ padding: 5, borderRadius: 10 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5">Create a Module</Typography>
              <Typography variant="body1" color="#616161" align="center" marginY={1} sx={{ width: 300,  marginBottm: 10 }}>
                Add a title that suits the context of your module then add some Italian text that you would like to practice!
              </Typography>
              <TextField marign="normal" label="title" type="text" name="title" sx={{ mt: 3, mb: 2 }} />
              <TextField marign="normal" label="text" type="text" name="text" sx={{ mt: 2, mb: 2 }} />
              <Typography marginBottom={2} color='#d32f2f'>
                {error}
              </Typography>
              <Button type="Submit">Create</Button>
            </Box>
          </Paper>
        )}
    </ThemeProvider>
  );
}

export default CreateModule;
