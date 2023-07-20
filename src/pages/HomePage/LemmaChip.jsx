import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { slideIn } from '../../utils/motion.js';
import Loader from '../../components/Loader/Loader.jsx';
import { 
  XMarkIcon 
} from '@heroicons/react/24/outline';

const LemmaChip = ({ lemma, loadingLemma, welcome, setWelcome }) => {
  const [color, setColor] = useState(null);

  useEffect(() => {  
    if (['E'].includes(lemma.pos))
      setColor("bg-sunglow-200")
    else if (['S'].includes(lemma.pos))
      setColor("bg-bittersweet-200")
    else if (['V', 'VA'].includes(lemma.pos))
      setColor("bg-skyblue-200")
    else if (['A', 'AP'].includes(lemma.pos))
      setColor("bg-tropicalindigo-200")

  }, [lemma]);

  return (
    <>
      { welcome.tipRight ? 
        (
          <div className="relative flex flex-col p-6 border-4 
            select-none rounded-lg text-slate-800 border-sunglow-200 
            bg-sunglow-50 border-dashed mb-6 font-geologica"
          >
            <XMarkIcon 
              onClick={() => setWelcome(prevwelcome => ({ ...prevwelcome, tipRight: false}))} 
              className="h-4 w-4 absolute right-3 -translate-y-3"
            />
            <span className="text-xl">
              Word Card
            </span>
            <p className="font-light">
              The word card shows what word you've clicked on, its translation, and where else you
              have seen the word from your other modules.
            </p>
          </div>
        ) : (
          null
        )
      } 
      <motion.div 
        variants={slideIn("left", 0.10)} initial="hidden" animate="show"
        className="border-2 space-y-3 flex p-6 flex-col border-b-4
        bg-slate-100 border-slate-400 rounded-lg text-slate-800 font-geologica"
      >
        { loadingLemma ? 
          (
            <div className='flex w-full items-center justify-center my-12'>
              <Loader />
            </div>            
          ) : (      
            <>
              <div className='flex flex-col mb-3'>
                <p className='text-slate-500 text-xl pb-2'>Word</p>
                <div className={`text-3xl font-semibold w-max ${color} rounded-md px-2 py-1`}>
                  {lemma.original}
                </div>   
                <div className="text-2xl font-light w-max bg-slate-200 rounded-md px-1 mt-1">
                  {['V', 'VA'].includes(lemma.pos) ? 'to ' : null}{lemma.translation}
                </div>
              </div>                
              <div>
                {lemma.sentences.map((sentence) => {
                  return (
                    <>
                      <div className="flex flex-col my-4 space-y-1 text-xl">
                        <p className="font-light">
                          {sentence.original[0]}
                          <span className={`px-1 ${color} rounded-md`}>{sentence.original[1]}</span>
                          {sentence.original[2]}
                        </p>
                        <p className="font-extralight text-slate-500">
                          {sentence.translation}
                        </p>
                      </div>
                      <div className="border-2 border-slate-200 w-1/4"/>
                    </>                      
                  )
                })}
              </div>
            </>
            )
          }                            
      </motion.div>
    </>  
  )
}

export default LemmaChip;