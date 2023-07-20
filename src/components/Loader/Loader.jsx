import React from 'react';
import { motion } from 'framer-motion';

const loaderTransition = (delay) => {
  return {
    duration: 0.5,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 0.5,
    delay: delay,
  }
};

const Loader = () => {

  return (
    <div className="flex space-x-1">
      <motion.div
        className="p-2 rounded-full bg-tropicalindigo-200"
        animate={{
          y: ["0%", "0%", "-50%", "0%"],
        }}
        transition={loaderTransition(0.1)}            
      />
      <motion.div
        className="p-2 rounded-full bg-sunglow-200"
        animate={{
          y: ["0%", "0%", "-50%", "0%"],
        }}
        transition={loaderTransition(0.2)}            
      />
      <motion.div
        className="p-2 rounded-full bg-bittersweet-200"
        animate={{
          y: ["0%", "0%", "-50%", "0%"],
        }}
        transition={loaderTransition(0.3)}            
      />
      <motion.div
        className="p-2 rounded-full bg-skyblue-200"
        animate={{
          y: ["0%", "0%", "-50%", "0%"],
        }}
        transition={loaderTransition(0.4)}            
      />
    </div>
    
  )
}

export default Loader;