import React from "react";
import { motion } from 'framer-motion';
import { slideIn } from '../../utils/motion.js';

const Welcome = ({ setWelcome }) => {

  return (
    <>
      <motion.div 
        variants={slideIn("left", 0.10)} 
        initial="hidden" 
        animate="show" 
        className='flex h-sansnavbar justify-center items-center'
      >
        <div className='max-h-5/6 flex flex-col border-dashed border-4 
          border-slate-300 rounded-lg w-1/3 p-6 font-geologica'
        >
          <p className='mb-6 text-2xl'>Welcome to QuizItalian! 👋</p>
          <div className='flex flex-col font-light text-lg space-y-3 mb-6'>
          <p>
            QuizItalian is an app that was built to improve the language learning 
            process for Italian. At the moment, QuizItalian covers 4 
            basic parts of speech:
          </p>   
          <div  className="flex">
            <span className="bg-sunglow-200 rounded-md px-2 pb-1 mr-2">prepositions</span>              
            <span className="bg-skyblue-200 rounded-md px-2 pb-1 mr-2">verbs</span>              
            <span className="bg-bittersweet-200 rounded-md px-2 pb-1 mr-2">nouns</span>              
            <span className="bg-tropicalindigo-200 rounded-md px-2 pb-1 mr-2">adjectives</span>
          </div>                   
          <p>
            The process is simple:
          </p>
          <p><span className="font-semibold">1. </span>Create a module by submitting Italian text.</p>
          <p><span className="font-semibold">2. </span>Complete the 5 quizzes associated with the module.</p>
          <p><span className="font-semibold">3. </span>Come back to the module whenever you need to refresh your vocabulary.</p>
          <p>
            More functionality is still to come. Leave a review and a suggestion if you enjoyed the app.
          </p>
          <p>
            Thanks!
          </p>
          </div>
          <div className="flex justify-center">
          <button 
            onClick={() => setWelcome(prevWelcome => ({ ...prevWelcome, welcomeCard: false}))} 
            className="border-2 p-2 px-3 hover:bg-slate-200 border-slate-800 
              text-slate-800 font-geologica rounded-full"
            >
            Continue
          </button>
          </div>           
        </div>          
      </motion.div>
    </>
  )
}

export default Welcome;