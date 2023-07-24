import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

function QuizInput({ 
  correctAnswer, 
  index, 
  isSubmit, 
  wordbankMode, 
  setWordbank, 
  setInputSelections, 
  inputSelection, 
  setSelection,
  verbHelper,
  colors,
  setInputTyped,
  showHints,
}) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hint, setHint] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  // THEME TEST
  const hintVariant = {
    hidden: { opacity: 0, y: '-100%'},
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, type: "spring"}}
  }  

  // Call this each time answers are submitted
  useEffect(() => {
    if (isSubmit) {

      // Evaluate submissions   
      if (wordbankMode)  
        checkAnswer(inputSelection.answer.word);
      else
        checkAnswer(userAnswer);
    } else {

      // Clearing all typed inputs
      setUserAnswer('');

      // Reset Wordbank and Selections
      clearSelection();

      setIsCorrect(false);
    }
    setIsLoaded(true);
  }, [isSubmit]);

  const clearSelection = () => {
    
    // Clear the selectioninput
    setInputSelections((selections) => selections.map((item) => {
      if (item.index == index)
        return ({ ...item, answer: {index: null, word: '', isHidden: true}})
      else
        return item
    }))

    // Update the word bank
    setWordbank((wordbank) => wordbank.map((item) => {
      if (item.index == inputSelection.answer.index)
        return ({ ...item, isHidden: false})
      else
        return item
    }))
  }

  // Check if the user submission is correct
  const checkAnswer = (userAnswer) => {
    
    // Convert all types to string
    if (typeof correctAnswer != "string") {
      userAnswer = userAnswer.toString();
      correctAnswer = correctAnswer.toString();
    }
    
    // Compare the word 
    if (correctAnswer.toLowerCase() === userAnswer.toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  // Pass the reference to the parent
  const focus = () => {
    setIsFocus(true);
    setHint(true);
    if (wordbankMode) {
      setSelection(inputSelection);
    }
  }

  const blur = () => {
    setIsFocus(false);
    setHint(false);
  }

  const handleClick = () => {
    if (inputSelection.answer.index != null && isFocus) {      
      setWordbank((prevWordbank) => prevWordbank.map((item) => {
        if (inputSelection.answer.index == item.index)
          return ({ ...item, isHidden: false })
        else
          return item;
      }))

      clearSelection();
    }
  }

  // Record user inputs
  const recordAnswer = (e) => {

    // Prohibit white space entries
    const value = e.target.value;
    const sanitizedValue = value.replace(/\s/g, '');

    setInputTyped((inputs) => inputs.map((input) => {
      if (input.index == index)
        return ({ ...input, answer: sanitizedValue})
      else
        return input
    }))

    setUserAnswer(sanitizedValue);
  }
  
  return (
    <>
      <div className="mr-2 relative align-middle 
        flex flex-col items-center overflow-visible">
        <motion.input 
          onChange={(e) => recordAnswer(e)} 
          value={wordbankMode 
            ? (inputSelection.answer.word ? inputSelection.answer.word : '') 
            : userAnswer} 
          type="text" 
          whileFocus={{ y: -2.5 }} 
          onFocus={focus} 
          disabled={isSubmit}
          onBlur={blur} 
          onClick={wordbankMode ? handleClick : null}
          className={`font-geologica block px-2 py-1 caret-slate-500 text-slate-800
          bg-white rounded-md text-md placeholder-slate-400
          focus:outline-none focus:border-2 focus:border-b-4 ${colors.border.focus} w-32 overflow-hidden 
          ${wordbankMode ? isSubmit ? 'hover:cursor-default' : 'hover:cursor-pointer caret-transparent selection:bg-transparent' 
          : 'selection:bg-slate-400 selection:text-white'}
          ${isSubmit ? isCorrect ? 'border-green-400 border-2 border-b-4' 
          : 'border-red-400 border-2 border-b-4' : 'border border-slate-300'}`}
        />
        { hint && showHints ? 
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={hintVariant} 
          className="top-10 z-20 p-1 absolute 
          flex backdrop-blur-md backdrop-filter rounded-full"
        >
          { hint && verbHelper ? 
            (
              verbHelper.map((helper) => (
                helper ? (
                  <div className="bg-slate-200 text-slate-800 
                    px-2.5 m-1 p-1 whitespace-nowrap rounded-full font-geologica
                    font-extralight text-lg"
                  >
                    {helper}
                  </div>
                ) : (
                  null
                )                
              ))
            ) : 
            (
              null
            )                          
          }
        </motion.div> : null}
      </div>
    </>
  )
};

export default QuizInput;