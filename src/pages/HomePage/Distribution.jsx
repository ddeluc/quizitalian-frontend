import React, {useState, useEffect} from 'react';

const Distribution = ({ pcount, vcount, ncount, acount }) => {
  const [dist, setDist] = useState([]);

  useEffect(() => {
    const total = pcount + vcount + ncount + acount;
    let result = [];
    result.push(Math.round((acount/total) * 100) + '%');
    result.push(Math.round((pcount/total) * 100) + '%');    
    result.push(Math.round((ncount/total) * 100) + '%');
    result.push(Math.round((vcount/total) * 100) + '%');    
    setDist(result);
  }, [])

  return (
    <>
      <div class="flex w-full h-3 mr-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="flex flex-col justify-center overflow-hidden bg-tropicalindigo-200" 
          role="progressbar" 
          style={{width: dist[0]}} 
          aria-valuenow="25" 
          aria-valuemin="0" 
          aria-valuemax="100">
        </div>
        <div 
          className="flex flex-col justify-center overflow-hidden bg-sunglow-200" 
          role="progressbar" 
          style={{width: dist[1]}} 
          aria-valuenow="15" 
          aria-valuemin="0" 
          aria-valuemax="100">
        </div>
        <div 
          className="flex flex-col justify-center overflow-hidden bg-bittersweet-200" 
          role="progressbar" 
          style={{width: dist[2]}} 
          aria-valuenow="30" 
          aria-valuemin="0" 
          aria-valuemax="100">
        </div>
        <div 
          className="flex flex-col justify-center overflow-hidden bg-skyblue-200" 
          role="progressbar" 
          style={{width: dist[3]}} 
          aria-valuenow="5" 
          aria-valuemin="0" 
          aria-valuemax="100">
        </div>
      </div>
    </>
  )
}

export default Distribution;