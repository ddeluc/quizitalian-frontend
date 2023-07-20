import React, { useEffect, useState } from 'react';

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

function FlashQuizCard({ word, select }) {
  const [statusColor, setStatusColor] = useState();
  
  useEffect(() => {
    switch (word.status) {
      case 1:
        setStatusColor("");
        break;
      case 2:
        setStatusColor("#c5cae9");
        break;
      case 3:
        setStatusColor("#b7deb8")
        break;
    }

  }, [word.status]);

  return (
    <Card elevation={5} sx={{ width: 300, margin: 2, backgroundColor: statusColor, borderRadius: 5, }}>
      <CardActionArea 
      disabled = {word.status === 3 ? true : false}
      onClick={() => {
        select(word.id, word.content);
      }}>
        <Typography padding={2} variant="h6">
          {word.content}
        </Typography>        
      </CardActionArea>
    </Card>
  );
};

export default FlashQuizCard;