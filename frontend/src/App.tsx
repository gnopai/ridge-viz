import { useEffect, useState } from 'react';
import { sortBy } from 'lodash';
import { requestRidgePlots } from './api/ridge-plot';
import { getKernelConfigs } from './api/get-kernel-configs';
import { buildRidgeRequest } from './api/build-ridge-request';
import type { RidgeResult, KernelConfig, ParamRange, RidgeResponse } from './types';
import { KernelSelector } from './components/KernelSelector';
import { NumericInput } from './components/NumericInput';
import { Plot } from './components/Plot';
import { ParamRangeSelector } from './components/ParamRangeSelector';
import { PlotSelector } from './components/PlotSelector';

const defaultRange = (value: number | null): ParamRange | null => {
  if (value === null) return null;
  return { start: value, end: value, count: 1, type: 'linear' };
};

// TODO split out main component(s) from here, keep this light
function App() {
  // TODO switch to useReducer(reducer, initial), with reducer that just does { ...old, ... new }
  const [ridgeResponse, setRidgeResponse] = useState<RidgeResponse | null>(null);
  const [currentResult, setCurrentResult] = useState<RidgeResult | null>(null);
  const [kernelConfigs, setKernelConfigs] = useState<KernelConfig[]>([]);
  const [kernel, setKernel] = useState<KernelConfig | null>(null);
  const [kernelParamRange, setKernelParamRange] = useState<ParamRange | null>(null);
  const [lambdaRange, setLambdaRange] = useState<ParamRange>(defaultRange(1) as ParamRange);
  const [runs, setRuns] = useState<number>(5);

  const switchKernel = (kernel: KernelConfig | null) => {
    setKernel(kernel);
    setKernelParamRange(defaultRange(kernel?.paramValue || null));
  };

  useEffect(() => {
    if (kernelConfigs.length > 0) return;

    getKernelConfigs().then((response) => {
      setKernelConfigs(response.kernelConfigs);
      setKernel(response.kernelConfigs[0]);
      setKernelParamRange(defaultRange(response.kernelConfigs[0].paramValue));
    });
  }, []);

  const onSubmit = () => {
    if (!kernel) return;

    const request = buildRidgeRequest(kernel, kernelParamRange, lambdaRange, runs);

    requestRidgePlots(request).then((response) => {
      const sortedResponse = { ...response, results: sortBy(response.results, 'overallMSE') };
      setRidgeResponse(sortedResponse);
      setCurrentResult(sortedResponse.results[0]);
    });
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold">Ridge Viz</h1>
      <div className="flex flex-col items-center border-1 border-gray-300 mx-20 my-10 p-4">
        <div className="flex flex-row">
          <Plot title="Ridge Regression" imgSrc={currentResult?.ridgePlot} />
          <Plot title="MSE Breakdown" imgSrc={currentResult?.msePlot} />
        </div>
        <PlotSelector results={ridgeResponse?.results} onSelect={setCurrentResult} />
        <div className="flex flex-row items-center justify-center">
          <div className="grid grid-cols-3 gap-4 justify-center">
            <KernelSelector kernelConfigs={kernelConfigs} onSelectKernel={switchKernel} />
            <ParamRangeSelector
              label={kernel?.paramName}
              paramRange={kernelParamRange}
              onChange={setKernelParamRange}
            />
            <button
              className="row-span-2 min-w-24 h-9 ml-8 py-1 px-2 border-2 border-gray-300 text-gray-600 rounded cursor-pointer"
              onClick={onSubmit}
            >
              Submit
            </button>
            <NumericInput label="runs per model" value={runs} onChange={setRuns} />
            <ParamRangeSelector label="lambda" paramRange={lambdaRange} onChange={setLambdaRange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
