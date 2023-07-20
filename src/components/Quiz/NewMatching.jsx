import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shuffle, copyArray } from '../../utils/utils';
import { motion } from 'framer-motion';
import * as api from '../../api/index';

const NewMatching = ({ moduleData }) => {
  const navigate = useNavigate();
  
  let total = moduleData.cards.nouns.length
    + moduleData.cards.prepositions.length
    + moduleData.cards.infinitives.length
    + moduleData.cards.adjectives.length;

  const [scores, setScores] = useState([]);
  const [cardSet, setCardSet] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [leftStack, setLeftStack] = useState(null);
  const [rightStack, setRightStack] = useState(null);
  const [leftSelection, setLeftSelection] = useState(null);
  const [rightSelection, setRightSelection] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { 
    let cardSet = moduleData.cards.prepositions;
    cardSet = cardSet.concat(moduleData.cards.nouns);
    cardSet = cardSet.concat(moduleData.cards.adjectives);
    cardSet = cardSet.concat(moduleData.cards.infinitives);
    cardSet = cardSet.map((item, i) => ({ ...item, index: i+1}))

    total = cardSet.length;
    console.log(total);
    generateStacks(cardSet);
  }, []);
  
  const checkAnswers = async () => {
    let score = 0;
    await setLeftStack((prevStack) => prevStack.map((item) => { 
      if (item.index && item.pair) {
        if (item.index == item.pair.index) {
          score = score + 1;          
          return ({ ...item, correct: 1});
        } else {
          return ({ ...item, correct: 2});    
        }
      } else {
        return item;
      }
    }))

    const scoresCopy = [...scores];
    scoresCopy.push(score/2);
    setScores(scoresCopy);
  }

  // Create random stack of selections
  const generateStacks = (cards) => {
    console.log(cards);
    
    // Create a shuffled set
    let copySet = copyArray(cards);
    shuffle(copySet);

    const testSet = [];
    
    for (let i = 0; i < 6; i++)
      if (copySet.length != 0)
        testSet.push(copySet.pop());

    // Create the left stack
    const leftTestSet = copyArray(testSet);
    leftTestSet.map((item) => {
      item.pair = null;
      item.correct = 0;
    })
    setLeftStack(leftTestSet);

    // Create the right stack
    shuffle(testSet);
    const rightTestSet = copyArray(testSet);
    rightTestSet.map((item) => {
      item.paired = false;
    })
    setRightStack(rightTestSet);

    setCardSet(copySet);
    setIsLoaded(true);    
  }

  const clear = () => {
    setLeftStack((prevStack) => prevStack.map((item) => {
      item.pair = null;
      item.correct = 0;
      return item
    }))

    setRightStack((prevStack) => prevStack.map((item) => {
      item.paired = false;
      return item;
    }))

    setLeftSelection(null);
    setRightSelection(null);
    
    const scoresCopy = [...scores];
    scoresCopy.pop();
    setScores(scoresCopy);
  }

  const handleRedo = () => {
    setIsSubmit(false);
    clear();    
  };

  const handleSubmit = () => {
    checkAnswers();
    setIsSubmit(true);
  };

  const handleNext = () => {
    setIsSubmit(false);
    generateStacks(cardSet);
  }

  const handleFinish = async () => {
    const scoreCount = scores.reduce((a, b) => {return a+b;})
    const scorePercentage = Math.round((scoreCount / total) * 100) + '%';
    await api.updateModuleScore(moduleData._id, scorePercentage, 4);

    navigate("/");
  };

  const selectLeft = (index) => {
    if (isSubmit) return;

    const selection = leftStack.filter((item) => item.index == index); 

    if (selection[0].pair) {
      setRightStack((prevStack) => prevStack.map((item) => {
        if (item.index == selection[0].pair.index) 
          return ({ ...item, paired: false})
        else
          return item;        
      }))

      setLeftStack((prevStack) => prevStack.map((item) => {
        if (selection[0] && item.index == selection[0].index) {
          setLeftSelection(null);
          return ({ ...item, pair: null});
        } else {
          return item;
        }
      }))
    } else {
      setLeftStack((prevStack) => prevStack.map((item) => {
        if (item.index == index) {        
          setLeftSelection(item)
          return item;               
        } else {
          return item;
        }
      }))
    }    
  }

  const selctRight = (index) => {
    if (leftSelection) {

      const prevSelection = leftSelection.pair ? leftSelection.pair : null;      
      const selection = rightStack.filter((item) => item.index == index);      
      
      // Update Left
      setRightStack((prevStack) => prevStack.map((item) => {
        if (item.index == index) {
          item.paired = true;
          setRightSelection(item)
          return item;
        } else if (prevSelection && item.index == prevSelection.index) {
          return ({ ...item, paired: false})
        } else {
          return item;
        }
      }))

      // Update Right
      setLeftStack((prevStack) => prevStack.map((item) => {
        if (item.index == leftSelection.index) {
          setLeftSelection(null)
          item.pair = selection[0];
          return item;
        } else {
          return item;
        }
      }))
    }    
  }

  if (isLoaded) {
    return (
      <div className="flex flex-col gap-3 items-center">
        <div className={`flex flex-col rounded-xl items-center justify-center`}>
          <h1 className='text-xl mb-3 font-geologica text-slate-800'>
            {moduleData.title}
          </h1>
          <h1 className={`bg-slate-200 p-3 rounded-xl text-4xl font-bold text-slate-800 font-geologica`}>
            Matching
          </h1>
        </div>
        <div className="flex items-start w-full text-slate-800 mt-8 font-extralight font-geologica text-xl">
          <p>
            Match the Italian vocabulary on the left to the translations on the right.
          </p> 
        </div>                        
        <div className="flex space-x-20 container
          w-full h-50 text-slate-800"
        >
          <ul className="flex-1 w-1/2">
            { leftStack ? (
              leftStack.map((item) => (
                <li onClick={() => selectLeft(item.index)} 
                  className="h-24 mb-5 relative"
                >
                  {/* COLOR */}
                  <motion.div 
                    whileHover={{ x: isSubmit || item.pair ? 0 : 4 }} 
                    className={`p-2 pb-2 pl-3 rounded-xl 
                    ${!isSubmit ? 'hover:cursor-pointer' : ''} border-2 border-b-4  
                    ${item.pair ? 'bg-slate-200 border-slate-400' : '' }            
                    ${item.index == leftSelection?.index && !isSubmit 
                    ? `border-slate-400 bg-slate-200`
                    : `${ !isSubmit ? 'hover:border-slate-400 hover:bg-slate-200 border-slate-300' : ''}`}`}
                  >              
                    <div className={`text-slate-800 
                      mb-2 select-none font-geologica text-xl font-extralight`}
                    >
                      {item.original}
                    </div>                
                    { item.pair ? (
                      <div className={`mr-1 font-geologica font-thin text-lg text-slate-800 px-3 
                        py-0.5 rounded-full border-2 select-none
                        ${item.correct == 0 ? `bg-slate-200 border-slate-300` 
                        : item.correct == 1 ? 'border-green-300 bg-green-200' 
                        : 'border-red-300 bg-red-200'}`}>
                        {item.pair.translation}
                      </div>
                    ) : (
                      <div className={`text-slate-800 mr-1 px-3 
                        py-1 rounded-full border
                        select-none font-geologica font-thin
                        ${item.index == leftSelection?.index && !isSubmit
                        ? `border-2 border-slate-300 bg-slate-200`
                        : 'border-slate-300'}`}
                      >
                        none
                      </div>
                    )}
                  </motion.div>
                </li>
              ))
              ) : (
                null
              )
            }
          </ul>
          <ul className="flex-1 w-1/2">
          { rightStack ? (
              rightStack.map((item) => (              
                <li className={`h-14`}>
                  <motion.div onClick={() => {if (!item.paired) selctRight(item.index)}} 
                    whileHover={{ x: item.paired || isSubmit ? 0 : 5 }} 
                    className={`p-2 pl-4 rounded-full select-none font-geologica font-extralight text-lg
                    ${item.paired || isSubmit ? `text-slate-400 bg-slate-100 hover:cursor-default` 
                    : `text-slate-800 bg-slate-200 hover:text-slate-800 hover:cursor-pointer`} `}
                  >
                    {item.translation}
                  </motion.div>                
                </li>
              ))
              ) : (
                null
              )
            }
          </ul>
        </div> 
        <div className="flex my-3 w-5/12 mt-5 items-center justify-center">
          <div className="flex justify-center w-1/3">
            <motion.button 
              whileHover={{scale: isSubmit ? 1.05 : 1}} 
              disabled={!isSubmit}
              onClick={handleRedo} 
              className={`p-3 border-2 ${isSubmit ? 'border-slate-800 text-slate-800' : 'border-slate-300 text-slate-300'} rounded-full font-geologica`}
            >
              REDO
            </motion.button>            
          </div>
          <div className="flex justify-center w-1/3">
            <motion.button 
              whileHover={{scale: !isSubmit ? 1.05 : 1}} 
              disabled={isSubmit}
              onClick={handleSubmit} 
              className={`p-3 border-2 ${isSubmit ? 'border-slate-300 text-slate-300' : 'border-slate-800 text-slate-800'} rounded-full font-geologica`}
            >
              SUBMIT
            </motion.button>
          </div>
          <div className="flex justify-center w-1/3">
            <motion.button 
              whileHover={{scale: isSubmit ? 1.05 : 1}} 
              disabled={!isSubmit}
              onClick={cardSet.length != 0 ? handleNext : handleFinish} 
              className={`p-3 border-2 ${isSubmit ? 'border-slate-800 text-slate-800' : 'border-slate-300 text-slate-300'} rounded-full font-geologica`}
            >
              { cardSet.length == 0 ? 'FINISH' : 'NEXT' }
            </motion.button>            
          </div>
        </div>
        <div className="flex items-center justify-center mb-6 font-geologica text-3xl">
          <p>
            {scores.length != 0 ? scores.reduce((a, b) => {return a+b;}) : 0}
            /
            {total}
          </p>
        </div>   
      </div> 
    )
  } else {
    return (
      <>Loading...</>
    )
  };
};

export default NewMatching;