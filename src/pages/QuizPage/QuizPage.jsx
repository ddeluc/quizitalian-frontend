import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../../components/Loader/Loader.jsx';

import * as api from '../../api/index.jsx';
import { slideIn, } from '../../utils/motion.js';
import FillInTheBlank from '../../components/Quiz/FillInTheBlank.jsx';
import NewMatching from '../../components/Quiz/NewMatching.jsx';

const QuizPage = ({ quizType }) => {
  const { username, id } = useParams();
  const [module, setModule] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModule();
  }, []);

  const getModule = async () => {
    try {
      const { data } = await api.getModule(username, id);
      setModule(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const quizMode = () => {
    if (quizType == 4) {
      return (        
        <NewMatching
          moduleData={module}
        />
      )      
    } else if (quizType == 5) {
      // Conjugation
    } else {
      return (
        <FillInTheBlank 
          moduleData={module} 
          quizType={quizType}
        />
        
      )
    }    
  }
  
  if (!loading) {
    return (
      <>
        {module ? (
          <div className='flex justify-center h-sansnavbar'>
            <motion.div 
              initial="hidden" 
              animate="show" 
              variants={slideIn('left')} 
              className='hover:cursor-default select-none p-8 w-4/6'
            >
              {quizMode()}
            </motion.div>          
          </div>
        ) : (
          <>No Module</> 
        )}
      </>
    )
  } else {
    return (
      <div className="flex h-sansnavbar w-screen justify-center items-center">
        <Loader />
      </div>
    )
  }  
}

export default QuizPage;
