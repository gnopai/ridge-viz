import { useEffect, useState } from 'react';
import { sortBy } from 'lodash';
import { requestRidgePlots } from './api/ridge-plot';
import { getKernelConfigs } from './api/get-kernel-configs';
import { buildRidgeRequest } from './api/build-ridge-request';
import type { RidgeResult, KernelConfig, RidgeResponse, RidgeForm } from './types';
import { Plot } from './components/Plot';
import { PlotSelector } from './components/PlotSelector';
import { InputForm } from './components/InputForm';
import { MultiPlot } from './components/MultiPlot';

function App() {
  const [ridgeResponse, setRidgeResponse] = useState<RidgeResponse | null>(null);
  const [currentResult, setCurrentResult] = useState<RidgeResult | null>(null);
  const [kernelConfigs, setKernelConfigs] = useState<KernelConfig[]>([]);

  useEffect(() => {
    if (kernelConfigs.length > 0) return;

    getKernelConfigs().then((response) => {
      setKernelConfigs(response.kernelConfigs);
    });
  }, []);

  const onSubmit = (form: RidgeForm) => {
    const request = buildRidgeRequest(form);

    requestRidgePlots(request).then((response) => {
      const sortedResponse = { ...response, results: sortBy(response.results, 'overallMSE') };
      setRidgeResponse(sortedResponse);
      setCurrentResult(sortedResponse.results[0]);
    });
  };

  const mseSubtitle = currentResult?.runs ? `(${currentResult?.runs} runs)` : '';

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold">Ridge Viz</h1>
      <div className="flex flex-col items-center border-1 border-gray-300 mx-20 my-10 p-4">
        <div className="flex flex-row">
          <MultiPlot title="Sample Ridge Regression" ridgeResult={currentResult} />
          <Plot title={`Model MSE Breakdown ${mseSubtitle}`} imgSrc={currentResult?.msePlot} />
        </div>
        <PlotSelector results={ridgeResponse?.results} onSelect={setCurrentResult} />
        <InputForm kernelConfigs={kernelConfigs} onSubmit={onSubmit} className="mt-2"/>
      </div>
    </div>
  );
}

export default App;
