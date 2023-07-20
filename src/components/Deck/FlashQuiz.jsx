import React, { useState, useEffect } from 'react';

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

import FlashQuizCard from './FlashQuizCard';

function FlashQuiz({ quizCards, setFlashQuizMode }) {
  const [quizArray, setQuizArray] = useState([]);
  const [selection, setSelection] = useState();
  const [score, setScore] = useState(0);

  useEffect(() => {
    mixUp();
  }, []);

  const select = (id, content) => {
    if (!selection) {
      setSelection({id: id, content: content});
      modifyStatus(id, 2);
    } else {
      if (selection.id * id > 0) {
        setSelection({ id: id, content: content});
        modifyStatus(selection.id, 1);
        modifyStatus(id, 2);
      } else {       
          let front = selection;
          let back = {id: id, content: content};
          if (selection.id > 0) {
            front = {id: id, content: content};
            back = selection;           
          }

          const result = quizCards.filter((card) => {
            return (card.front === front.content && card.back === back.content);
          })

          if (result.length === 0) {
            modifyStatus(id, 1);
            modifyStatus(selection.id, 1);
          } else {
            modifyStatus(id, 3);
            modifyStatus(selection.id, 3);
            const newScore = score + 1;
            if (newScore === 6) {
              setFlashQuizMode(false);
            }
            setScore(newScore);
          }
        
        setSelection(null);   
      }
    }
  };

  const modifyStatus = (id, status) => {
    const result = quizArray.map((word) => {
      if (word.id === id) {
        word.status = status;
      }
      return word;
    })

    setQuizArray(result);
  }; 

  const mixUp = () => {
    console.log('called')
    let refArray = [];
    for (let i = 0; i < quizCards.length; i++) {
      refArray.push(i);
    };

    let result = [];
    for (let i = 0; i < quizCards.length; i++) {
      const randomNumber = Math.floor(Math.random() * refArray.length);      
      const backIndex = refArray.splice(randomNumber, 1);

      // Create left array
      const left = { content: quizCards[i].front, id: (i+1)*-1, status: 1 }
      result.push(left);      

      // Create right array
      const right = { content: quizCards[backIndex].back, id: i+1, status: 1 }
      result.push(right);
    };

    setQuizArray(result);
  };  

  if (quizArray) return (
    <Grid item display="flex" justifyContent="center" alignItems="center" xs={12}>
      <Box margin={2}>
        <Grid container sx={{ maxWidth: 900 }}>
          { quizArray.map((word) => (
            <>
              <Grid item display="flex" justifyContent="center" alignItems="center" xs={6}>
                <FlashQuizCard word={word} select={select} />
              </Grid>
            </>                  
          ))}
        </Grid>
      </Box>
    </Grid>
  )
}

export default FlashQuiz;