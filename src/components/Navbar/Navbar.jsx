import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, Outlet } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import { motion } from 'framer-motion';
import { logoSlideIn } from '../../utils/motion';
import ReviewModal from './ReviewModal';

function Navbar({ userData, setToken, setUserData, welcome }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUserData(null);
    navigate('/');
  };

  return (  
    <>
      <div onClick={() => navigate('/')} className="flex justify-between items-center bg-transparent h-navbar">
        <div className="ml-6 font-geologica text-3xl flex items-baseline text-slate-800 select-none hover:cursor-pointer">
          <motion.div variants={logoSlideIn(1)} initial="hidden" animate="show" className="bg-tropicalindigo-200 rounded-md mr-0.5 py-2.5 px-1" />
          <motion.div variants={logoSlideIn(0.75)} initial="hidden" animate="show" className="bg-sunglow-200 rounded-md mr-0.5 py-2.5 px-1" />
          <motion.div variants={logoSlideIn(0.5)} initial="hidden" animate="show" className="bg-bittersweet-200 rounded-md mr-0.5 py-2.5 px-1" />
          <motion.div variants={logoSlideIn(0.25)} initial="hidden" animate="show" className="bg-skyblue-200 rounded-md mr-0.5 py-2.5 px-1" />
          <p className="font-extrabold flex">
            Quiz
          </p>
          <p className="font-extralight">
            Italian
          </p>
        </div>
        <div className="flex items-baseline space-x-6 mr-6">
          <p className="text-slate-800 font-geologica text-xl font-base">
            {userData.username}
          </p>
          <button 
            onClick={openModal} 
            className="mr-6 text-slate-800 font-geologica text-xl font-extralight"
            type="button"            
            data-te-toggle="modal"
            data-te-target="#exampleModal"
            data-te-ripple-init
            data-te-ripple-color="light">
              Logout
          </button>
        </div>        
      </div>
      <ReviewModal isOpen={isModalOpen} onClose={closeModal} logout={logout} />
      <Outlet />
    </>      
  );
}

export default Navbar;
