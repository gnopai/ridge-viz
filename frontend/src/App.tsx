import { useState } from 'react';
import { requestRidgePlot } from './api/ridge-plot';


function App() {
  const [ridgePlot, setRidgePlot] = useState<string>('Nope');

  const onSubmit = () => {
    requestRidgePlot().then((response) => {
      setRidgePlot(response.img_src);
    });
  };
    
  return (
    <div className="flex flex-col items-center border-1 border-gray-300 mx-20 my-10">
      <h1 className="text-3xl font-bold p-4">Ridge Viz</h1>
      <div className="flex flex-row items-center">
        <img src={ridgePlot} className=""/>
        <button
          className="min-w-24 h-9 py-1 px-2 border-2 border-gray-300 text-gray-600 rounded cursor-pointer"
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default App
