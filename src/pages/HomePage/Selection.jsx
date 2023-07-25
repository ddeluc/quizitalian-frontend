import React from "react";
import { motion } from 'framer-motion';
import styles from "../../styles.js";
import { useNavigate } from 'react-router-dom';
import { slideIn } from '../../utils/motion.js';
import * as api from '../../api/index.jsx';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Selection = ({ 
    selected, 
    userData, 
    setLemma, 
    view, 
    setView, 
    setLoadingLemma, 
    welcome, 
    setWelcome 
  }) => {

  const navigate = useNavigate();

  const animationVariant = {
    hidden: { x: '-150%'},
    visible: { x: 0, transition: { duration: 0.5, type: "spring" }},
  };

  // Choose a word to display
  const selectLemma = async (lemma) => {  
    setLoadingLemma(true);  
    const { data } = await api.getLemma(userData.id, lemma);
    if (data[0]) {
      setLemma(data[0]);
    }        
    setLoadingLemma(false);
  }

  return (
    <>
      { welcome.tipMid ? 
        (
          <div className="relative flex flex-col p-6 border-4 select-none rounded-lg 
            text-slate-800 border-sunglow-200 bg-sunglow-50 border-dashed mb-6 font-geologica"
          >
            <XMarkIcon 
              onClick={() => setWelcome(prevwelcome => ({ ...prevwelcome, tipMid: false}))} 
              className="h-4 w-4 absolute right-3 -translate-y-3"
            />
            <span className="text-xl">
              Module Card
            </span>
            <p className="font-light">
              This is where you can view your module. Each module has 5 quizzes, 4 of which correspond
              to a part of speech:
              &nbsp;
              <span className="bg-sunglow-200 rounded-md px-2">prepositions</span>
              &nbsp; 
              <span className="bg-skyblue-200 rounded-md px-2">verbs</span>
              &nbsp; 
              <span className="bg-bittersweet-200 rounded-md px-2">nouns</span>
              &nbsp;
              <span className="bg-tropicalindigo-200 rounded-md px-2">adjectives</span>
              &nbsp;
              Once each module is 100% complete, you can view the original text and interact 
              with each word that is associated with each part of speech.
            </p>
          </div>
        ) : (
          null
        )
      }      
      <motion.div 
        variants={slideIn("left", 0.10)} 
        transition="show"
        initial="hidden"
        animate="show"
        className="flex-col border-2 p-6 space-y-2 border-b-4 bg-slate-100 border-slate-400 rounded-lg"
      >
        <h1 className="text-4xl text-slate-800 font-geologica font-bold 
          hover:cursor-default select-none"
        >
          {selected.title}
        </h1>
        <div className="flex space-x-3 items-center">          
          <div className="flex">
            <button 
              onClick={() => {
                if (selected.complete) {
                  setView(!view);
                  setLemma(false);
                }
              }} 
              className={`text-3xl text-slate-300 font-geologica rounded-full
              ${ !selected.complete ? 'hover:text-slate-500' : 'hover:text-slate-800'}`}
            >
              { !view ? 
                <div className="group flex items-center">
                  <EyeIcon className="h-8 w-8" /> 
                  <span className={`ml-2 ${ !selected.complete ? 'group-hover:opacity-100' : ''} 
                    text-slate-500 w-max font-light transition-opacity text-base
                    opacity-0`}
                  >
                    complete the module to view the original text
                  </span>
                </div>                
              : 
                <EyeSlashIcon className="h-8 w-8"/> 
              }              
            </button>
          </div>         
        </div>
        <div className="flex items-center font-geologica text-xl text-slate-500">
          Quizzes
        </div>             
        <div className={`flex flex-wrap`}>
          <motion.div
            initial="hidden" 
            animate="visible" 
            variants={animationVariant}
            className='mr-3 mb-2'
          >
            <motion.button 
              className={`${styles.quizButton} border-sunglow-300 bg-sunglow-200`} 
              whileHover={{ y: -4 }}             
              onClick={() => navigate(`/quiz/prepositions/${userData.username}/${selected._id}`)}
            >
              Prepositions 
            </motion.button>
            <div class="w-full bg-slate-200 rounded-full h-2.5">
              <div class="bg-green-400 h-2.5 rounded-full" style={{width: selected.quizScores[0]}}></div>
            </div>
          </motion.div>               
          <motion.div
            initial="hidden" 
            animate="visible" 
            variants={animationVariant}
            className='mr-3 mb-2'
          >
            <motion.button
              className={`${styles.quizButton} border-skyblue-300 bg-skyblue-200`} 
              whileHover={{ y: -4 }}
              initial="hidden" 
              animate="visible" 
              variants={animationVariant} 
              onClick={() => navigate(`/quiz/verbs/${userData.username}/${selected._id}`)}
            >
              Verbs
            </motion.button>
            <div class="w-full bg-slate-200 rounded-full h-2.5">
              <div class="bg-green-400 h-2.5 rounded-full" style={{width: selected.quizScores[1]}}></div>
            </div>
          </motion.div>
          <motion.div
            initial="hidden" 
            animate="visible" 
            variants={animationVariant}
            className='mr-3 mb-2'
          >
            <motion.button 
              className={`${styles.quizButton} border-bittersweet-300 bg-bittersweet-200`} 
              whileHover={{ y: -4 }}
              initial="hidden" 
              animate="visible" 
              variants={animationVariant} 
              onClick={() => navigate(`/quiz/nouns/${userData.username}/${selected._id}`)}
            >
              Nouns
            </motion.button>
            <div class="w-full bg-slate-200 rounded-full h-2.5">
              <div class="bg-green-400 h-2.5 rounded-full" style={{width: selected.quizScores[2]}}></div>
            </div>
          </motion.div>
          <motion.div
            initial="hidden" 
            animate="visible" 
            variants={animationVariant}
            className='mr-3 mb-2'
          >
            <motion.button 
              className={`${styles.quizButton} border-tropicalindigo-300 bg-tropicalindigo-200`} 
              whileHover={{ y: -4 }}
              initial="hidden" 
              animate="visible" 
              variants={animationVariant} 
              onClick={() => navigate(`/quiz/adjectives/${userData.username}/${selected._id}`)}
            >
              Adjectives
            </motion.button>
            <div class="w-full bg-slate-200 rounded-full h-2.5">
              <div class="bg-green-400 h-2.5 rounded-full" style={{width: selected.quizScores[3]}}></div>
            </div>
          </motion.div>
          <motion.div
            initial="hidden" 
            animate="visible" 
            variants={animationVariant}
            className='mr-3 mb-2'
          >
            <motion.button 
              className={`${styles.quizButton} border-slate-400 bg-slate-200`} 
              whileHover={{ y: -4 }}
              initial="hidden" 
              animate="visible" 
              variants={animationVariant} 
              onClick={() => navigate(`/quiz/matching/${userData.username}/${selected._id}`)}
            >
              Matching
            </motion.button>
            <div class="w-full bg-slate-200 rounded-full h-2.5">
              <div class="bg-green-400 h-2.5 rounded-full" style={{width: selected.quizScores[4]}}></div>
            </div>
          </motion.div>
        </div>     
        <div className="flex items-center font-geologica text-xl text-slate-500">
          Original Text
        </div>                                     
        <div className="flex flex-wrap hover:cursor-default">          
          {selected.sentences.map((sentence, i) => {
            return (
            sentence.tokens.map((token, j) => (
              token.isMultiwordToken && !token.isMultiwordFirstToken ? 
              (
                null
              ) : (
                <>
                  <motion.div 
                    whileHover={{ y: ['S', 'E', 'A', 'AP', 'V', 'VA'].includes(token.pos) && view ? -2 : 0 }} 
                    onClick={() => {
                      if (view)
                        selectLemma(token.lemma)
                    }}
                    className={`text-2xl flex 
                    items-center hover:cursor-default mx-0.5 mb-1.5 px-1.5 py-1
                    rounded-lg select-none font-geologica font-extralight
                    ${view ? '' : 'text-transparent'}
                    ${token.color ? token.color + ' hover:cursor-pointer' : 'bg-slate-200'}`}
                  >
                    {token.originalText}
                  </motion.div>
                  <div className="select-none">
                    &nbsp;
                  </div>
                </>                    
              )
            )))
          })}
        </div>
      </motion.div>
    </>
  )
}

export default Selection;