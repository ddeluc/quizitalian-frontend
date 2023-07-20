import React from 'react';
import { motion } from 'framer-motion';
import { KeyIcon } from '@heroicons/react/24/solid';

const Wordbank = ({ wordbank, selectWord, active, activate, colors }) => {

  // THEME TEST
  const animationVariant = {
    hidden: { opacity: 0, x: '-100%'},
    visible: { opacity: 1, x: 0, transition: { duration: 0.25, type: "spring" }},
  };

  // TAILWINDCSS
  return (
    <div className="flex mt-6">
      <div className="group flex items-center">
        <motion.button 
          onClick={() => activate(!active)} 
          whileHover={{ scale: 1.05 }}
          className={`rounded-full mr-4 ${ active ? colors.bg[200] : 
          'bg-slate-300' } ${colors.bg.hover}
          p-2.5 flex h-11 items-center select-none`}
        >
          <KeyIcon className="h-6 w-6"/>
        </motion.button>
        { !active ? 
          (
            <span className={`${ !active ? 'group-hover:opacity-100' : '' } text-slate-500 w-max font-geologica font-light transition-opacity text-base opacity-0`}>
              Enable wordbank
            </span>
          ) : (
            null
          )
        }         
      </div>      
      <div className={`flex flex-wrap items-center`}>               
        { active ? (
          wordbank.map((word, i) => (
            <motion.button 
              disabled={word.isHidden} 
              onClick={() => {selectWord(word)}} 
              whileHover={{ scale: word.isHidden ? 1 : 1.05 }} 
              initial="hidden" 
              animate="visible" 
              variants={animationVariant} 
              className={`rounded-full text-xl font-geologica 
              font-extralight mr-2 ${colors.bg[200]} p-1 my-1 px-3 
              text-slate-800 ${colors.bg.hover} 
              select-none disabled:${colors.bg[100]} 
              disabled:text-slate-400`}
            >
              {word.word}
            </motion.button>
          ))
          ) : (
            null
          )
        }
      </div> 
    </div>
  )
};

export default Wordbank;