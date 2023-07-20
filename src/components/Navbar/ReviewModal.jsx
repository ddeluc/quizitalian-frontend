import React, { useState } from "react";
import { motion } from 'framer-motion';
import { slideIn } from '../../utils/motion.js';
import * as api from '../../api/index.jsx';

const ReviewModal = ({ isOpen, onClose, logout }) => {
  const [reviewInput, setReviewInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const updateReview = (event) => {
    setReviewInput(event.target.value);
  }

  const submitReview = async () => {
    if (reviewInput != '') {
      const data = await api.saveReview(reviewInput);
      console.log(data);
      setSubmitted(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed backdrop-blur-sm backdrop-filter border border-red-500 inset-0 z-10 flex items-center justify-center outline-none font-geologica">
      <div className="relative w-auto shadow-xl rounded-lg border-b-4 max-w-md mx-auto my-6 border-2 border-slate-400 ">
        <div className="p-6 flex flex-col rounded-lg bg-slate-100">
          <h1 className="text-xl font-semibold mb-4">Leave a Review</h1>
          <p className="mb-4 font-light">
            Before you go, let me know what you think. How can I improve QuizItalian?
            If you enjoyed the app and would like to support the developer, you can leave a tip
            <a 
              href="https://donate.stripe.com/7sIcPp9pEeNnbFm288"
              target="_blank"
              className="ml-1 underline hover:text-skyblue-300"
            >
              here
            </a>
            .
          </p>
          <textarea 
            onChange={updateReview}
            disabled={submitted}
            className='border disabled:text-slate-400 placeholder-slate-300 rounded-lg w-full h-56 focus:outline-slate-400 resize-none text-xl p-3 font-geologica border-slate-300 text-slate-800 font-extralight' 
          />
          <div className="flex justify-end">
          { submitted ? 
            (
              <motion.p
                variants={slideIn("left", 0.10)} 
                initial="hidden" 
                animate="show"
                className="text-green-400 my-3"
              >
                Thank you for your submission!
              </motion.p>
            ) : (
              <button onClick={submitReview} className="p-3 rounded-full border-slate-800 text-slate-400 font-geologica hover:text-slate-800">
                Submit Review
              </button>
            )
          }            
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={onClose} className="p-3 rounded-full border-slate-800 text-slate-400 font-geologica hover:text-slate-800">
              CLOSE
            </button>
            <button onClick={logout} className="border-2 px-3 py-1 rounded-full border-slate-800 font-geologica hover:bg-slate-200">
              LOGOUT
            </button>
          </div>      
        </div>
      </div>
    </div>
  )
}

export default ReviewModal;