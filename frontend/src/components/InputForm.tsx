import { useEffect, useState, type FC } from 'react';
import type { KernelConfig, ParamRange, RidgeForm } from '../types';
import { KernelSelector } from './KernelSelector';
import { NumericInput } from './NumericInput';
import { ParamRangeSelector } from './ParamRangeSelector';

const defaultRange = (value: number | null): ParamRange | null => {
  if (value === null) return null;
  return { start: value, end: value, count: 1, type: 'linear' };
};

export interface InputFormProps {
  kernelConfigs: KernelConfig[];
  onSubmit: (form: RidgeForm) => void;
}

export const InputForm: FC<InputFormProps> = ({ kernelConfigs, onSubmit }) => {
  const [kernel, setKernel] = useState<KernelConfig | null>(null);
  const [kernelParamRange, setKernelParamRange] = useState<ParamRange | null>(null);
  const [lambdaParamRange, setlambdaParamRange] = useState<ParamRange>(defaultRange(1) as ParamRange);
  const [runs, setRuns] = useState<number>(5);

  const switchKernel = (kernel: KernelConfig | null) => {
    setKernel(kernel);
    setKernelParamRange(defaultRange(kernel?.paramValue || null));
  };

  const onFormSubmit = () => {
    if (!kernel) return;
    onSubmit({ kernel, kernelParamRange, lambdaParamRange, runs });
  };

  useEffect(() => {
    setKernel(kernelConfigs[0]);
    setKernelParamRange(defaultRange(kernelConfigs[0]?.paramValue));
  }, [kernelConfigs]);

  return (
    <div className="flex flex-row items-center justify-center">
      <div className="grid grid-cols-3 gap-4 justify-center">
        <KernelSelector kernelConfigs={kernelConfigs} onSelectKernel={switchKernel} />
        <ParamRangeSelector label={kernel?.paramName} paramRange={kernelParamRange} onChange={setKernelParamRange} />
        <button
          className="row-span-2 min-w-24 h-9 ml-8 py-1 px-2 border-2 border-gray-300 text-gray-600 rounded cursor-pointer"
          onClick={onFormSubmit}
        >
          Submit
        </button>
        <NumericInput label="runs per model" value={runs} onChange={setRuns} />
        <ParamRangeSelector label="lambda" paramRange={lambdaParamRange} onChange={setlambdaParamRange} />
      </div>
    </div>
  );
};
