import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { shuffle } from '../../utils/utils';
import QuizInput from './QuizInput';
import Wordbank from './Wordbank';
import { LanguageIcon } from '@heroicons/react/24/solid';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import * as api from '../../api/index.jsx';
import { partsOfSpeech } from '../../constants';

const FillInTheBlank = ({ moduleData, quizType }) => { 
  const navigate = useNavigate();
  let inputIndex = 0;
  const pos = partsOfSpeech[quizType].pos;
  const colors = partsOfSpeech[quizType].colors;

  const [score, setScore] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [selection, setSelection] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [wordbank, setWordbank] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [inputSelections, setInputSelections] = useState(null);
  const [inputTyped, setInputTyped] = useState(null);
  const [wordbankMode, setWordbankMode] = useState(pos.includes('S') || pos.includes('A') ? true : false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [translateActive, setTranslateActive] = useState(false);

  useEffect(() => {    
    setIsLoaded(false);
    generateWordbank();
    setIsLoaded(true);
  }, []);

  // Selecting word from wordbank
  const selectWord = (word) => {
    if (selection) { 

      // Manage the wordbank state:
      // Set the selected word to inactive;
      // Replace word set to active
      setWordbank((wordbank) => wordbank.map((item) => {
        if (item.index == word.index)
          return ({ ...item, isHidden: true})
        else if (item.index == selection.answer.index)
          return ({ ...item, isHidden: false})
        else
          return item
      }))

      // Set the selection answer to the word chosen
      setInputSelections((selections) => selections.map((item) => {
        if (selection.index == item.index)
          return ({ ...item, answer: word});
        else
          return item;
      }))

      setSelection(null);
    }   
  }

  const handleSubmit = async () => {
    await grade();
    setIsSubmit(true);    
  }

  const grade = async () => {
    let count = 0;
    answers.forEach((answer) => {
      if (wordbankMode) {
        if (answer.correctAnswer == inputSelections[answer.index].answer.word.toLowerCase())
          count++;
      } else {
        if (answer.correctAnswer == inputTyped[answer.index].answer.toLowerCase())
          count++;
      }
    })

    setScore(count);
  }

  const handleSave = async () => {
    const scorePercentage = Math.round((score / answers.length) * 100) + '%';
    await api.updateModuleScore(moduleData._id, scorePercentage, quizType);
    
    navigate("/");
  }

  const handleRedo = () => {
    setIsSubmit(false);
    setWordbankMode(false);
    setTranslateActive(false);

    setInputTyped((inputTyped) => inputTyped.map((item) => {
      return ({ ...item, answer: ''})
    }))

    setScore(0);
  }

  // Create an array of blank answers
  const generateWordbank = () => {
    const wbArray = [];
    const isArray = [];
    const answersArray = [];
    const itArray = [];

    // Iterate through sentences and add the 
    // words with the appropriate POS property
    let index = 0;
    moduleData.sentences.forEach((sentence, i) => {
      sentence.tokens.forEach((token, j) => {
        if (pos.includes(token.pos)) {
          wbArray.push({index: index, word: token.originalText.toLowerCase(), isHidden: false});
          isArray.push({index: index, answer: {index: null, word: '', isHidden: true}});
          answersArray.push({index: index, correctAnswer: token.originalText.toLowerCase()});
          itArray.push({index: index++, answer: ''});
        }        
      })
    })

    shuffle(wbArray);
    setInputTyped(itArray);
    setAnswers(answersArray);
    setInputSelections(isArray);
    setWordbank(wbArray);
  }

  // TAILWINDCSS
  if (isLoaded) {
    return (
      <>
        <div className='flex flex-col items-center gap-3'>
          {/* COLOR */}
          <div className={`flex flex-col rounded-xl items-center justify-center`}>
            <h1 className='text-2xl mb-3 font-geologica text-slate-800'>
              {moduleData.title}
            </h1>
            <h1 className={`${partsOfSpeech[quizType].colors.bg[200]} p-3 rounded-xl text-4xl font-bold text-slate-800 font-geologica`}>
              {partsOfSpeech[quizType].context.title}
            </h1>
          </div>          
          <div className='flex items-start w-full text-slate-800 mt-8 font-extralight font-geologica text-xl'>
            Fill in the blanks with the correct {partsOfSpeech[quizType].context.plural}.           
          </div>
          <div className="card border-2 border-b-4 bg-slate-100 border-slate-400
          p-6 w-full h-50 text-slate-800">
            <div className="flex flex-wrap hover:cursor-default">
              { moduleData.sentences.map((sentence, i) => (
                  sentence.tokens.map((token, j) => {
                    return (
                      (pos.includes(token.pos)) ?
                      (
                        <QuizInput 
                          setSelection={setSelection}
                          setWordbank={setWordbank}
                          inputSelection={inputSelections.find(obj => obj.index == inputIndex)}
                          setInputSelections={setInputSelections}
                          wordbankMode={wordbankMode}  
                          verbHelper={pos.includes('V') ? token.helper : null }
                          correctAnswer={token.originalText} 
                          index={inputIndex++} 
                          colors={colors}
                          isSubmit={isSubmit}
                          setInputTyped={setInputTyped}
                          inputTyped={inputTyped}
                          showHints={showHints}
                        />                        
                      ) : (
                        token.isMultiwordToken && !token.isMultiwordFirstToken ? 
                        (
                          null
                        ) : (
                          <div className="pb-4 text-2xl flex 
                            items-center hover:cursor-default select-none text-slate-800 font-geologica font-thin">
                            {token.originalText}
                            {sentence.tokens[j+1] && sentence.tokens[j+1].ud_pos=='PUNCT' ? null : <>&nbsp;</>}
                          </div>
                        )
                      )                                           
                    )
                  })
                ))
              }
            </div>
            <Wordbank 
              selectWord={selectWord} 
              wordbank={wordbank} 
              active={wordbankMode} 
              activate={setWordbankMode}  
              colors={colors}         
            />
            <div className="group flex mt-3 items-center">              
              <motion.button 
                onClick={() => setTranslateActive(!translateActive)} 
                whileHover={{ scale: 1.05 }}
                className={`rounded-full h-11 mr-4 ${ translateActive ? colors.bg[200] : 
                'bg-slate-300' } ${colors.bg.hover}
                p-2.5 flex items-center select-none`}
              >                
                <LanguageIcon className="h-6 w-6"/>                             
              </motion.button>
              { translateActive ?
                <motion.p initial={{ y: '-100%', opacity: 0 }} animate={{ y: '0%', opacity: '100%', transition: {duration: 0.5, type: 'spring'}}} className={`p-2 px-3 rounded-lg bg-slate-200 font-geologica font-extralight text-xl text-slate-800`}>
                  {moduleData.translatedText}
                </motion.p>
              :
                null
              }
              <span className={`${ !translateActive ? 'group-hover:opacity-100' : '' } text-slate-500 w-max font-geologica font-light transition-opacity text-base opacity-0`}>
                Show translation
              </span>
            </div>
            { pos.includes('V', 'VA') ?
              ( 
                <div className="group flex mt-3 items-center">
                  <motion.button 
                    onClick={() => setShowHints(!showHints)} 
                    whileHover={{ scale: 1.05 }}
                    className={`rounded-full h-11 mr-4 ${ showHints ? colors.bg[200] : 
                    'bg-slate-300' } ${colors.bg.hover}
                    p-2.5 flex items-center select-none`}
                  >
                    <LightBulbIcon className="h-6 w-6"/>
                  </motion.button>
                  <span className={`${ !showHints ? 'group-hover:opacity-100' : '' } text-slate-500 w-max font-geologica font-light transition-opacity text-base opacity-0`}>
                    Enable hints
                  </span>
                </div>                
              ) : (
                null
              )
            }
          </div>
          <div className="flex my-3 w-5/12 mt-5 items-center justify-center">
            <div className="flex justify-center w-1/3">
              <motion.button 
                whileHover={{scale: isSubmit ? 1.05 : 1}} 
                disabled={!isSubmit}
                onClick={handleRedo} 
                className={`p-3 border-2 ${isSubmit ? 'border-slate-800 text-slate-800' : 'border-slate-300 text-slate-300'} rounded-full font-geologica`}
              >
                REDO
              </motion.button>            
            </div>
            <div className="flex justify-center w-1/3">
              <motion.button 
                whileHover={{scale: !isSubmit ? 1.05 : 1}} 
                disabled={isSubmit}
                onClick={handleSubmit} 
                className={`p-3 border-2 ${isSubmit ? 'border-slate-300 text-slate-300' : 'border-slate-800 text-slate-800'} rounded-full font-geologica`}
              >
                SUBMIT
              </motion.button>
            </div>
            <div className="flex justify-center w-1/3">
              <motion.button 
                whileHover={{scale: isSubmit ? 1.05 : 1}} 
                disabled={!isSubmit}
                onClick={handleSave} 
                className={`p-3 border-2 ${isSubmit ? 'border-slate-800 text-slate-800' : 'border-slate-300 text-slate-300'} rounded-full font-geologica`}
              >
                SAVE
              </motion.button>            
            </div>
          </div>
          <div className="flex items-center justify-center mb-6 font-geologica text-3xl">
            <p>
              {isSubmit ? (Math.round((score / inputIndex) * 100)) + '%' : null}
            </p>
          </div>
        </div>              
      </>
    )
  } else {
    return (
      <>
        Loading
      </>
    )
  }  
};

export default FillInTheBlank;