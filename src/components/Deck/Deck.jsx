import React, { useState } from 'react';

import {
  Typography,
  Grid,
  Box,
  Card,
  createTheme,
  ThemeProvider,
  Button,
  CardActionArea,
} from '@mui/material';

import Flashcard from '../Flashcard/Flashcard';
import FlashQuiz from './FlashQuiz';

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

function Deck({ module }) {
  const [flashQuizMode, setFlashQuizMode] = useState(false);
  const [quizCards, setQuizCards] = useState();

  const generateFlashQuiz = () => {
    setFlashQuizMode(true);
    let chosen = [];
    let flashcards = [ ...module.flashcards];
    for (let i = 0; i < 6; i++) {
      let randomIndex = Math.floor(Math.random() * flashcards.length);
      let flashcard = flashcards.splice(randomIndex, 1);
      chosen.push(flashcard[0]);
    }
    
    setQuizCards(chosen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item display="flex" justifyContent="center" alignItems="center" xs={12}>
          <Typography marginTop={4} variant="h4">Flashcards</Typography>
        </Grid>
        
        { flashQuizMode ?
          <>
            <Grid item margin={2} display="flex" justifyContent="center" alignItems="center" xs={12}>
              <Button size="large" variant="contained" onClick={() => {setFlashQuizMode(false)}}>
                Flashcards
              </Button>
            </Grid>
            <Grid item margin={2} display="flex" justifyContent="center" alignItems="center" xs={12}>
              <Typography variant="body1" color="#616161" align="center" marginBottom={1} sx={{ width: 500 }}>
                Match the Italian words on the left to the correct English translation on the right.
                Note: Some of the Italian words will map to the same English translation.
              </Typography>
            </Grid>
            <FlashQuiz quizCards={quizCards} setFlashQuizMode={setFlashQuizMode} />
          </>          
        :
        <>
          <Grid item margin={2} display="flex" justifyContent="center" alignItems="center" xs={12}>
            <Button size="large" variant="contained" onClick={generateFlashQuiz}>
              FlashQuiz
            </Button>
          </Grid>
          <Grid item display="flex" justifyContent="center" alignItems="center" xs={12}>
            <Box margin={4}>
            <Grid container>
            { module.flashcards && (module.flashcards.length > 0)
              ? (
                <>
                  {module.flashcards.map((flashcard) => (
                    <Grid 
                      item
                      display="flex"
                      justifyContent="center"
                      alignItems="center" 
                      xs={2} 
                      key={flashcard._id} 
                    >
                      <Flashcard front={flashcard.front} back={flashcard.back} />
                    </Grid>
                  ))}
                </>
              )
              : (
                <Typography>No Flashcards</Typography>
              )}
            </Grid>
            </Box>
          </Grid>
        </>          
        }
        
      </Grid>
    </ThemeProvider>
  );
}

export default Deck;
