import React from 'react';

function Module({ module }) {
  let indexRef = 0;

  return (
    <>
      <div className="border text-3xl">
        {module.title}
      </div>
      <div className="flex border flex-wrap hover:cursor-default">          
        {module.sentences.map((sentence, i) => {
          return (
          sentence.tokens.map((token, j) => (
            token.isMultiwordToken && !token.isMultiwordFirstToken ? 
            (
              null
            ) : (
              <>
                <div className={`text-2xl flex 
                  items-center hover:cursor-default mx-0.25 mb-1 px-1.5 pb-1
                  rounded-lg bg-slate-200 select-none ${indexRef++ > 3 ? 'text-transparent' : ''}`}>
                  {token.originalText}
                </div>
                <div>
                  &nbsp;
                </div>
              </>                    
            )
          )))
        })}
      </div>
    </>
  )
}

export default Module;
