import React, { useState } from 'react';

import {
  Card,
  Typography,
  Button,
  CardActions,
  createTheme,
  ThemeProvider,
} from '@mui/material';

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

function Flashcard({ front, back }) {
  const [face, setFace] = useState(true);

  const flip = () => {
    setFace(!face);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        elevation={10}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          length: 100,
          width: 500,
          margin: 5,
          padding: 5,
          borderRadius: 5,
        }}
      >
        <Typography variant="h5" marginBottom={1}>{face ? front : back}</Typography>
        <CardActions>
          <Button variant="outlined" onClick={flip}>Flip</Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export default Flashcard;
