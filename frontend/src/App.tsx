import { useEffect, useState } from 'react';
import { requestRidgePlots } from './api/ridge-plot';
import { getKernelConfigs } from './api/get-kernel-configs';
import { buildRidgeRequest } from './api/build-ridge-request';
import type { KernelConfig, ParamRange, RidgeResponse } from './types';
import { KernelSelector } from './components/KernelSelector';
import { NumericInput } from './components/NumericInput';
import { Plot } from './components/Plot';


function App() {
  const [ridgeResponse, setRidgeResponse] = useState<RidgeResponse|null>(null);
  const [kernelConfigs, setKernelConfigs] = useState<KernelConfig[]>([]);
  const [kernel, setKernel] = useState<KernelConfig|null>(null);
  const [kernelParam, setKernelParam] = useState<number|null>(null);
  const [lambda, setLambda] = useState<number>(1);
  const [runs, setRuns] = useState<number>(5);

  const switchKernel = (kernel: KernelConfig | null) => {
    setKernel(kernel);
    setKernelParam(kernel?.paramValue || null);
  };

  useEffect(() => {
    if (kernelConfigs.length > 0) return;

    getKernelConfigs().then((response) => {
      setKernelConfigs(response.kernelConfigs);
      setKernel(response.kernelConfigs[0]);
      setKernelParam(response.kernelConfigs[0].paramValue);
    });
  }, []);

  const onSubmit = () => {
    if (!kernel) return;

    // TODO actually get ranges from UI
    const kernelParamRange: ParamRange | null = kernelParam ? { start: kernelParam, end: kernelParam, count: 1, type: 'linear' } : null;
    const lambdaParamRange: ParamRange = { start: lambda, end: lambda, count: 1, type: 'linear' };
    const request = buildRidgeRequest(kernel, kernelParamRange, lambdaParamRange, runs);

    requestRidgePlots(request).then((response) => {
      setRidgeResponse(response);
    });
  };
    
  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold">Ridge Viz</h1>
      <div className="flex flex-col border-1 border-gray-300 mx-20 my-10 p-4">
        <div className="flex flex-row">
            <Plot title="Ridge Regression" imgSrc={ridgeResponse?.results[0]?.ridgePlot} />
            <Plot title="MSE Breakdown" imgSrc={ridgeResponse?.results[0]?.msePlot} />
        </div>
        <div className="flex flex-row justify-center">
          <KernelSelector kernelConfigs={kernelConfigs} onSelectKernel={switchKernel} />
          <NumericInput value={kernelParam} onChange={setKernelParam} />
          <NumericInput value={lambda} onChange={setLambda} />
          <NumericInput value={runs} onChange={setRuns} />
          <button
            className="min-w-24 h-9 py-1 px-2 border-2 border-gray-300 text-gray-600 rounded cursor-pointer"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
