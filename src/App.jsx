import './index.css';
import React, { useEffect, useState, createContext } from 'react';
import LoginPage from './pages/Login/LoginPage';
import Navbar from './components/Navbar/Navbar';
import { Typography, Modal, Box, Fade, Button, createTheme, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import HomePage from './pages/HomePage/HomePage';
import QuizPage from './pages/QuizPage/QuizPage';

 
import OTPInput from './components/Auth/OTPInput';
import Recovered from './components/Auth/Recovered';
import Reset from './components/Auth/Reset';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
export const RecoveryContext = createContext();

function App() {
  const [userData, setUserData] = useState();
  const [token, setToken] = useState();
  const [welcome, setWelcome] = useState(false);

  const [page, setPage] = useState();
  const [email, setEmail] = useState();
  const [otp, setOTP] = useState();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserData(JSON.parse(localStorage.getItem('userdata')));
  }, []);

  function closeWelcome() {
    setWelcome(false);
  };

  function NavigateComponents () {
    if (page === "otp") return <OTPInput />;
    if (page === "reset") return <Reset />;
    return <LoginPage setToken={setToken} setWelcome={setWelcome} setUserData={setUserData} />;
  }

  if (!token) {
    return (
      <RecoveryContext.Provider
        value={{ page, setPage, otp, setOTP, setEmail, email }}
      >
        <div>         
          <NavigateComponents />
        </div>
      </RecoveryContext.Provider>              
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar userData={userData} setToken={setToken} setUserData={setUserData} welcome={welcome} />} >
          <Route path="/" element={<HomePage userData={userData} setToken={setToken} welcome={welcome} setWelcome={setWelcome}/>}/>
          <Route path="/quiz/prepositions/:username/:id" element={<QuizPage quizType={0} />}/>
          <Route path="/quiz/verbs/:username/:id" element={<QuizPage quizType={1} />}/>
          <Route path="/quiz/nouns/:username/:id" element={<QuizPage quizType={2} />}/>
          <Route path="/quiz/adjectives/:username/:id" element={<QuizPage quizType={3} />}/>
          <Route path="/quiz/matching/:username/:id" element={<QuizPage quizType={4} />}/>
          <Route path="*" element={<NotFoundPage />} />
        </Route>        
      </Routes>  
    </>
      
  );
}

export default App;
