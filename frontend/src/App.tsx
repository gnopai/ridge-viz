import { useEffect, useState } from 'react';
import { requestRidgePlot } from './api/ridge-plot';
import { getKernelConfigs } from './api/get-kernel-configs';
import type { KernelConfig } from './types';
import { KernelSelector } from './components/KernelSelector';
import { NumericInput } from './components/NumericInput';


function App() {
  const [ridgePlot, setRidgePlot] = useState<string>('Nope');
  const [kernelConfigs, setKernelConfigs] = useState<KernelConfig[]>([]);
  const [kernel, setKernel] = useState<KernelConfig|null>(null);
  const [kernelParam, setKernelParam] = useState<number|null>(null);
  const [lambda, setLambda] = useState<number>(1);

  const switchKernel = (kernel: KernelConfig | null) => {
    setKernel(kernel);
    setKernelParam(kernel?.paramDefault || null);
  };

  useEffect(() => {
    if (kernelConfigs.length > 0) return;

    getKernelConfigs().then((response) => {
      setKernelConfigs(response.kernelConfigs);
      setKernel(response.kernelConfigs[0]);
      setKernelParam(response.kernelConfigs[0].paramDefault);
    });
  }, []);

  const onSubmit = () => {
    if (!kernel) return;

    requestRidgePlot({
      kernel: kernel.name,
      kernelParamName: kernel.param,
      kernelParamValue: kernelParam,
      lambda,
    }).then((response) => {
      setRidgePlot(response.img_src);
    });
  };
    
  return (
    <div className="flex flex-col items-center border-1 border-gray-300 mx-20 my-10">
      <h1 className="text-3xl font-bold p-4">Ridge Viz</h1>
      <div className="flex flex-row items-center">
        <img src={ridgePlot} className=""/>
        <KernelSelector kernelConfigs={kernelConfigs} onSelectKernel={switchKernel} />
        <NumericInput value={kernelParam} onChange={setKernelParam} />
        <NumericInput value={lambda} onChange={setLambda} />
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
