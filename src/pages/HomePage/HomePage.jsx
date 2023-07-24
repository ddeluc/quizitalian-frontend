import React, { useState, useEffect } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import preprocessData from './processData.jsx';
import { motion } from 'framer-motion';
import { slideIn } from '../../utils/motion.js';
import Loader from '../../components/Loader/Loader.jsx';
import LemmaChip from './LemmaChip.jsx';
import Distribution from './Distribution.jsx';
import Selection from './Selection.jsx';
import Welcome from './Welcome.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import * as api from '../../api/index.jsx';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

function HomePage({ userData, welcome, setWelcome }) {
  const [selected, setSelected] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createMode, setCreateMode] = useState(false);
  const [titleInput, setTitleInput] = useState(null);
  const [textInput, setTextInput] = useState(null);
  const [lemma, setLemma] = useState(null);
  const [loadingLemma, setLoadingLemma] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [view, setView] = useState(false);

  useEffect(() => {
    getModules(userData);
  }, []);

  const addModule = (data, example) => {
    setModules(modules => [...modules, data]);
    if (!example) {
      setCreateMode(!createMode);
    }
  };

  // Create a module
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Set loading circle
      setCreating(true);
      let text = textInput;
      let title = titleInput;

      // Automatically use default text upon empty input
      if (!text) {
        text = `All'improviso mi è scattato qualcosa nella testa e ho pensato: "A me piace farlo". E in quel preciso istante ho scoperto una libertà che non posedevo prima.`;
      }

      // Automatically use default title upon empty input
      if (!title) {
        title = `Module${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
      }

      // Get Tint data
      const tintData = await api.tintRequest(text);   

      // Get all sentences: sentence: { tokens: [], verbs: []}
      const sentences = tintData.data.sentences;

      // Process the data
      const processedData = await preprocessData(sentences, text, userData);
      
      const sendData = {
        title: title,
        text: text,
        author: userData.username,
        cards: processedData.cards,
        textList: processedData.textList,
        verbList: processedData.verbList,
        translatedText: processedData.translatedText,
        sentences: sentences,
      };

      // Make post request
      const createModuleData = await api.createModule(sendData);

      await api.addLemmas(userData.id, processedData.lemmaArray);

      addModule(createModuleData.data, false);      

      setCreateMode(false);
      setCreating(false);
      setSelected(createModuleData.data);
      setCreateError(null);
    } catch (error) {
      setCreating(false);
      console.log(error);
      const message = error.response ? error.response.data.message : "Unable to create module."
      setCreateError(message);
    }
  };

  const handleSelection = (mod) => {
    if (createMode) 
      setCreateMode(false);
    setSelected(mod);
    setLemma(false);
    setView(false);
    setCreateError(null);
  }

  const deleteModule = async (id) => {
    try {
      await api.deleteModule(id);

      setSelected(null);
      getModules(userData);
    } catch (error) {
      // Handle Error
    }
  };

  const handleTitleChange = (event) => {
    setTitleInput(event.target.value);
  };

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const getModules = async () => {
    try {
      setLoading(true);
      const { data } = await api.getModules(userData.id);
      setModules(data);
      // setSelected(data[0]);
      setLoading(false);
    } catch (error) {
      // Handle Error
    }    
  };

  if (!loading) {
    if (welcome.welcomeCard) {
      return (
        <Welcome setWelcome={setWelcome} />
      )
    } else {
      return (
        <>        
          <div className="flex h-sansnavbarfooter">
            <div className=" pl-6 pr-3 py-6 flex-col flex-shrink-0 w-5/20 
              overflow-scroll overflow-x-hidden no-scrollbar"
            >
              { welcome.tipLeft ? 
                (
                  <div className="relative flex flex-col p-6 border-4 select-none 
                    rounded-lg text-slate-800 border-sunglow-200 bg-sunglow-50 
                    border-dashed mb-6 font-geologica"
                  >
                    <XMarkIcon 
                      onClick={() => setWelcome(prevwelcome => ({ ...prevwelcome, tipLeft: false}))} 
                      className="h-4 w-4 absolute right-3 -translate-y-3"
                    />
                    <span className="text-xl">
                      Modules Menu Card
                    </span>
                    <p className="font-light">
                      The modules menu is where you can create new modules and 
                      view your current modules. Each module shows the distribution 
                      of the words by their parts of speech. You can select a module 
                      by clicking on it.
                    </p>
                  </div>
                ) : (
                  null
                )
              } 
              <div className="border-2 max-h-sansnavbar border-b-4
                bg-slate-100 border-slate-400 rounded-lg"
              >
                <div className="flex items-center p-6">
                  <h1 className="text-2xl text-slate-800 font-geologica mr-2 font-semibold">
                    Modules
                  </h1>
                  <motion.button 
                    whileHover={{ scale: 1.03 }} 
                    onClick={() => {setLemma(false); setCreateMode(true)}} 
                    className="flex mr-2"
                  >                  
                    <div className="group relative items-center">
                      <PlusCircleIcon className="h-10 w-10 text-slate-800" />
                      <span className={`ml-1 absolute -translate-y-8 translate-x-5 
                        group-hover:opacity-100 text-slate-800 w-max font-geologica 
                        font-light transition-opacity text-base
                        opacity-0`}
                      >
                        create a module
                      </span>
                    </div>             
                  </motion.button>
                </div>
                <ul className="px-6 pb-3 max-h-96 overflow-y-scroll space-y-3 scro mb-6 mr-3">
                  {modules.map((module, i) => (
                    <motion.li 
                      whileHover={{ x: 4 }} 
                      onClick={() => handleSelection(module)} 
                      className={`border-2 border-b-4 hover:border-slate-400
                      border-slate-300 p-3 rounded-lg 
                      hover:bg-slate-200 flex flex-col justify-between items-center 
                      hover:cursor-pointer ${selected == module ? 'bg-slate-200' : ''}`}
                    >
                    <div className="flex justify-between w-full">
                      <p className="font-geologica flex items-center font-light 
                        text-xl text-slate-800"
                      >
                        { module.complete 
                          ? <CheckCircleIcon className="mr-2 text-green-400 h-8 w-8" /> 
                          : null 
                        }
                        {module.title}
                      </p>
                      <div className="flex justify-center items-center">                      
                        <XMarkIcon 
                          onClick={() => deleteModule(module._id)} 
                          className="hover:cursor-pointer hover:text-slate-800 text-slate-300 h-8 w-8"
                        />
                      </div>
                    </div> 
                    <div className="w-full mt-3">
                      <Distribution 
                        pcount={module.cards.prepositions.length} 
                        vcount={module.cards.infinitives.length} 
                        ncount={module.cards.nouns.length} 
                        acount={module.cards.adjectives.length} 
                      />     
                    </div>                   
                    </motion.li>
                  ))}
                </ul>
              </div>         
            </div>
            <div className="w-10/20 px-3 py-6 overflow-scroll overflow-x-hidden no-scrollbar">
              <div className="h-2/3">
              { creating ? 
                (
                  <Loader />
                ) : (
                  ( createMode ?
                    (
                      <>
                        <motion.div 
                          variants={slideIn("left", 0.10)} 
                          initial="hidden" 
                          animate="show" 
                          className="flex-col space-y-6 p-6 border-2 border-b-4 border-slate-400 
                          rounded-lg bg-slate-100"
                        >
                          <h1 className="text-3xl font-geologica text-slate-800">
                            Create Module
                          </h1>
                          <div>
                            <p className="font-geologica text-xl font-thin mb-3 text-slate-800">
                              Create a new module. The title must be between 5 and 25 characters.
                            </p>
                            <div>
                              <input 
                                className="w-full placeholder-slate-300 text-3xl p-3 border 
                                focus:outline-slate-400 rounded-lg font-geologica font-extralight
                                text-slate-800 border-slate-300" 
                                value={titleInput} 
                                onChange={handleTitleChange}
                                placeholder='Test Module'
                              />                    
                            </div>
                          </div>
                          <div>
                            <p className="font-geologica text-xl font-thin mb-3 text-slate-800">
                              Enter text. The text must be between 100 and 400 characters.
                            </p>
                            <div>          
                              <textarea 
                                className='border placeholder-slate-300 rounded-lg w-full h-72 
                                focus:outline-slate-400 resize-none text-xl p-3 font-geologica 
                                border-slate-300 text-slate-800 font-extralight' 
                                value={textInput} onChange={handleTextChange}
                                placeholder={
                                `All'improviso mi è scattato qualcosa nella testa e ho pensato: ` +
                                `A me piace farlo". E in quel preciso istante ho scoperto una libertà ` +
                                `che non posedevo prima. `}
                              />
                            </div>
                          </div> 
                          <div className="space-x-3 flex">
                            <motion.button 
                              whileHover={{ scale: 1.05 }} 
                              onClick={handleSubmit} 
                              className="border-2 p-3 rounded-full border-slate-800 font-geologica 
                              text-xl hover:bg-slate-200"
                            >
                              CREATE
                            </motion.button>
                            <button 
                              onClick={() => setCreateMode(false)} 
                              className="p-3 font-geologica text-xl text-slate-300 
                              hover:text-slate-800"
                            >
                              CANCEL
                            </button>
                          </div>                
                        </motion.div>
                        { createError ? 
                          (
                            <motion.div 
                              variants={slideIn("left", 0.10)} 
                              initial="hidden" 
                              animate="show" 
                              className="mt-6 font-geologica flex items-center text-xl 
                              font-light text-slate-800"
                            >
                              <ExclamationCircleIcon className='w-8 h-8 mr-2 text-red-500' />
                              {createError}
                            </motion.div>
                          ) : (
                            null
                          )
                        }                      
                      </>
                    ) : (
                      ( selected ?
                        (
                          <>
                            <Selection 
                              welcome={welcome} 
                              setWelcome={setWelcome} 
                              setLemma={setLemma} 
                              userData={userData} 
                              key={selected} 
                              selected={selected} 
                              setView={setView} 
                              view={view} 
                              setLoadingLemma={setLoadingLemma}
                            />
                            <motion.div 
                              variants={slideIn("left", 0.25)} 
                              initial="hidden" 
                              animate="show"  
                              className="border-2 border-b-4 bg-slate-100 rounded-lg 
                              my-6 border-slate-400 p-6"
                            >
                              <h1 className="mb-3 font-geologica text-2xl 
                                text-slate-800 font-semibold"
                              >
                                Translation
                              </h1>
                              <p className="text-xl font-geologica text-slate-800 font-extralight">
                                {selected.translatedText}
                              </p>
                            </motion.div>
                            <br />
                          </>
                        ) : (
                          <div className="flex p-6 border-4 rounded-lg border-slate-300 border-dashed 
                            items-center"
                          >
                            <p className="font-geologica font-extralight text-xl text-slate-800">
                              Select a Module. If you do not have any yet, create one by clicking this icon
                            </p>
                            &nbsp;
                            <motion.button 
                              whileHover={{ scale: 1.03 }} 
                              onClick={() => setCreateMode(true)} 
                              className="flex mr-2"
                            >
                              <PlusCircleIcon className="h-10 w-10 text-slate-800"></PlusCircleIcon>           
                            </motion.button>
                          </div>
                        )
                      )                  
                    )
                  )
                )
              }            
              </div>
            </div>
            <div className="w-5/20 pl-3 pr-6 py-6 overflow-scroll 
              overflow-x-hidden no-scrollbar"
            >
              { lemma ? 
                (
                  <LemmaChip
                    lemma={lemma} 
                    loadingLemma={loadingLemma} 
                    welcome={welcome} 
                    setWelcome={setWelcome} 
                  />
                ) : (
                  selected && !createMode ? (
                    <div className="flex p-6 border-4 rounded-lg border-slate-300 
                      border-dashed items-center"
                    >
                      <p className="font-geologica font-extralight text-xl text-slate-800">
                        Select a word to view its information.
                      </p>
                    </div>
                  ) : (
                    null
                  )              
                )
              }            
            </div>
          </div>
          <Footer />
        </>
      )
    }
  } else {
    return (
      <div className="flex h-sansnavbar w-screen justify-center items-center">
        <Loader />
      </div>      
    )
  }
}

export default HomePage;