import type { KernelConfig, ParamRange, RidgeRequest } from '../types';

const DECIMALS = 12;

export const buildRidgeRequest = (kernel: KernelConfig, kernelParamRange: ParamRange | null, lambdaParamRange: ParamRange, runs: number): RidgeRequest => {
  const kernelParams = kernelParamRange ? expandParamRange(kernelParamRange) : [null];
  const lambdas = expandParamRange(lambdaParamRange);
  const staticFields = { kernelName: kernel.name, kernelParamName: kernel.paramName, runs };

  const configs = [];
  for (const lambda of lambdas) {
    for (const kernelParamValue of kernelParams) {
      configs.push({ ...staticFields, kernelParamValue, lambda });
    }
  }
  return { configs };
};

const expandParamRange = (paramRange: ParamRange) => {
  if (paramRange.count === 1) {
    return [paramRange.start];
  }
  return paramRange.type === 'linear' ? buildLinearList(paramRange) : buildLogList(paramRange);
};

const buildLinearList = ({ start, end, count }: ParamRange): number[] => {
  const list: number[] = [];
  const step = (end - start) / (count - 1);
  for (let i = 0; i < count; i++) {
    list.push(start + i * step);
  }
  return list.map(i => Number(i.toFixed(DECIMALS)));
};

const buildLogList = (paramRange: ParamRange): number[] => {
  const exponents = buildLinearList(paramRange);
  return exponents
    .map(exp => 10**exp)
    .map(i => Number(i.toFixed(DECIMALS)));
};
