import React from "react";
import { useContext, useState } from "react";
import { RecoveryContext } from "../../App";
import * as api from '../../api/index.jsx';

export default function Reset() {
  const { setPage, email } = useContext(RecoveryContext);
  const [showPassword, setShowPassword] = useState('false');
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const changePassword = async () => {
    setPage("recovered");

    try {
        const data = await api.updatePassword({
            email: email,
            password: password,
            confirmPassword: confirmPassword,
        });
    } catch (error) {
        console.log(error);
    };
  }

  const updatePassword = (event) => {
    setPassword(event.target.value);
  }

  const updateConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  }

  return (
    <div>
      <section className="w-screen">
        <div className="font-geologica flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg border border-slate-200 md:mt-0 sm:max-w-md sm:p-8">
            <h2 className="text-xl leading-tight text-slate-800 tracking-tight mb-3">
              Change Password
            </h2>            
            <div className="w-full mb-6">
              <div className="flex justify-between">
                <p className="mb-1 font-geologica font-extralight text-slate-800 text-base">
                  Password                  
                </p>
                <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400 font-light font-geologica hover:text-slate-800">
                  { showPassword ? 'hide password' : 'show password' }
                </button>
              </div>                
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password} 
                onChange={updatePassword} 
                className={`block px-3 caret-slate-500 text-slate-800
                bg-white border border-slate-300 rounded-md text-lg placeholder-slate-400
                focus:outline-none focus:border-2 focus:border-slate-400 focus:border-b-4 py-2 w-full`}
              />                           
            </div>
            <div className="w-full mb-6">
              <div className="flex justify-between">
                <p className="mb-1 font-geologica font-extralight text-slate-800 text-base">
                  Confirm Password                  
                </p>
              </div>                
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={confirmPassword} 
                onChange={updateConfirmPassword} 
                className={`block px-3 caret-slate-500 text-slate-800
                bg-white border border-slate-300 rounded-md text-lg placeholder-slate-400
                focus:outline-none focus:border-2 focus:border-slate-400 focus:border-b-4 py-2 w-full`}
              />                           
            </div>               
            <button
              onClick={() => changePassword()}
              className="border-2 border-slate-800 bg-primary-600 hover:bg-slate-200 focus:outline-none focus:ring-primary-300 rounded-full px-5 py-2.5 text-center"
            >
              Reset password
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}