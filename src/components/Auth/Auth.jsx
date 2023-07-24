// https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

import React, { useState, useContext } from 'react';
import { RecoveryContext } from '../../App.jsx';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logoSlideIn } from '../../utils/motion.js';
import { ExclamationCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import { BACKEND_URL } from '../../constants/index.jsx';
import axios from 'axios';

import * as api from '../../api/index.jsx';

function Auth({ setUserData, setToken, setWelcome }) {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);
  const [usernameInput, setUsernameInput] = useState();
  const [passwordInput, setPasswordInput] = useState();
  const [confirmPasswordInput, setConfirmPasswordInput] = useState();

  const { setEmail, setPage, email, setOTP } = useContext(RecoveryContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      // handle signup
      try {
        const { data } = await api.signUp({ username: usernameInput, password: passwordInput, confirmPassword: confirmPasswordInput });
        // POTENTIAL ERROR: Used deconstruction here. If it breaks
        // revert back to const token = data.token;
        const token = data.token;
        const userdata = {id: data.result._id, username: data.result.username};

        // Setup user data and token
        setUserData(userdata);
        setToken(token);
        setWelcome({welcomeCard: true, tipLeft: true, tipMid: true, tipRight: true});
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('userdata', JSON.stringify(userdata));   
        navigate('/');
      } catch (error) {
        console.log(error)
        setError(error.response.data.message);
      }
    } else {
      // handle signin
      try {
        setSigningIn(true);
        const { data } = await api.signIn({ username: usernameInput, password: passwordInput });
        const token = data.token;
        const userdata = {id: data.result._id, username: data.result.username};

        // Setup user data and token
        setUserData(userdata);
        setToken(token);
        setWelcome({welcomeCard: false, tipLeft: false, tipMid: false, tipRight: false});
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('userdata', JSON.stringify(userdata));
        navigate('/');
      } catch (error) {
        console.log(error)
        setError(error.response.data.message);
      }
      setSigningIn(false);
    }    
  };

  const handlePasswordChange = (event) => {
    setPasswordInput(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPasswordInput(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsernameInput(event.target.value);
  };

  function navigateToOtp() {
    if (usernameInput) {
      const OTP = Math.floor(Math.random() * 9000 + 1000);
      setEmail(usernameInput);
      setOTP(OTP);

      axios
        .post(`${BACKEND_URL}/send_recovery_email`, {
          OTP,
          recipient_email: usernameInput,
        })
        .then(() => setPage("otp"))
        .catch(console.log);
      return;
    }
    return alert("Please enter your email");
  }

  return (
    <>
      <div className="flex w-full h-screen justify-center">
        <div className="flex-col flex pt-36 font-geologica">
          <div className="font-geologica justify-center mb-8 text-6xl flex items-baseline text-slate-800 select-none">
            <motion.div variants={logoSlideIn(1)} initial="hidden" animate="show" className="bg-tropicalindigo-200 rounded-md mr-1 py-5 px-1.5" />
            <motion.div variants={logoSlideIn(0.75)} initial="hidden" animate="show" className="bg-sunglow-200 rounded-md mr-1 py-5 px-1.5" />
            <motion.div variants={logoSlideIn(0.5)} initial="hidden" animate="show" className="bg-bittersweet-200 rounded-md mr-1 py-5 px-1.5" />
            <motion.div variants={logoSlideIn(0.25)} initial="hidden" animate="show" className="bg-skyblue-200 rounded-md mr-1 py-5 px-1.5" />
            <p className="font-extrabold flex">
              Quiz
            </p>
            <p className="font-extralight">
              Italian
            </p>
          </div>             
          <div className="flex flex-col justify-between h-auto items-center w-full">  
            <div className="flex items-start w-full font-geologica text-2xl text-slate-800 mb-3">
              <p>{ !isSignup ? 'Sign In' : 'Create Account' }</p>
            </div>                   
            <div className='flex flex-col w-full h-full'>
              <div className="w-full mb-6">
                <p className="mb-1 font-geologica font-extralight text-slate-800 text-base">Email</p>
                <input 
                  type="email" 
                  required
                  value={usernameInput} 
                  onChange={handleUsernameChange} 
                  className={`block px-3 caret-slate-500 text-slate-800
                  bg-white border border-slate-300 rounded-md text-lg placeholder-slate-400 font-geologica
                  focus:outline-none focus:border-2 focus:border-slate-400 focus:border-b-4 py-2 w-full`}                  
                />
              </div>
              <div className="w-full mb-6">
                <div className="flex justify-between">
                  <p className="mb-1 font-geologica font-extralight text-slate-800">
                    Password                  
                  </p>
                  <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400 font-light font-geologica hover:text-slate-800">
                    { showPassword ? 'hide password' : 'show password' }
                  </button>
                </div>                
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={passwordInput} 
                  onChange={handlePasswordChange} 
                  className={`block px-3 caret-slate-500 text-slate-800
                  bg-white border border-slate-300 rounded-md text-lg placeholder-slate-400
                  focus:outline-none focus:border-2 focus:border-slate-400 focus:border-b-4 py-2 w-full`}
                />
                { isSignup ?
                  (
                    null
                  ) : (
                    <button 
                      onClick={() => navigateToOtp()}
                      className="underline text-slate-400 font-light font-geologica hover:text-slate-800">
                      forgot password?
                    </button>
                  )
                }                
              </div>              
              { isSignup ?
                (
                  <div className="w-full mb-6">
                    <p className="mb-1 font-geologica font-extralight text-slate-800 text-base">Confirm Password</p>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={confirmPasswordInput}
                      onChange={handleConfirmPasswordChange} 
                      className={`block px-3 caret-slate-500 text-slate-800
                      bg-white border border-slate-300 rounded-md text-lg placeholder-slate-400
                      focus:outline-none focus:border-2 focus:border-slate-400 focus:border-b-4 py-2 w-full`}/>
                  </div>
                ) : (
                  null
                )
              }              
            </div>   
            <div className="flex w-full justify-between mt-6">
              <button 
                onClick={() => {
                  setIsSignup(!isSignup);
                  setPasswordInput('');
                  setUsernameInput('');
                  setConfirmPasswordInput('');
                  setError(null);
                }} 
                className="font-geologica font-light text-slate-400 hover:text-slate-800"
              >
                { !isSignup ? 'CREATE ACCOUNT' : 'SIGN IN' }               
              </button>
              <button onClick={handleSubmit} className="border-2 p-2 px-3 hover:bg-slate-200 border-slate-800 text-slate-800 font-geologica rounded-full">
                { !isSignup ? signingIn ? 'SIGNING IN...' : 'SIGN IN' : 'CREATE ACCOUNT' }
              </button>
            </div>
            <div className="flex w-full">
              { error ? 
                (
                  <div className="px-3 py-1 bg-slate-100 rounded-full mt-6 font-geologica flex items-center text-lg font-light text-slate-800">
                    <ExclamationCircleIcon className='w-8 h-8 mr-2 text-red-500' />
                    {error}
                  </div>
                ) : (
                  null
                )
              }  
            </div>                    
          </div>
        </div>
      </div>
    </>
  )
}

export default Auth;
