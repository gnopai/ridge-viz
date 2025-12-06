export interface RidgeResponse {
  results: RidgeResult[];
  message: string;
}

export interface RidgeConfig {
  lambda: number;
  runs: number;
  kernelName: string;
  kernelParamName: string | null;
  kernelParamValue: number | null;
}

export interface RidgeResult extends RidgeConfig {
  overallMSE: number;
  ridgeFullPlot: string;
  ridgeProcessPlot: string;
  ridgeModelPlot: string;
  ridgeSamplesPlot: string;
  msePlot: string;
}

export interface RidgeRequest {
  configs: RidgeConfig[]
}

export interface RidgeForm {
  kernel: KernelConfig;
  kernelParamRange: ParamRange | null;
  lambdaParamRange: ParamRange;
  runs: number;
}

export interface KernelConfig {
  name: string;
  paramName: string | null;
  paramValue: number | null;
}

export type ParamRangeType = 'linear' | 'log';

export interface ParamRange {
  type: ParamRangeType;
  start: number;
  end: number;
  count: number;
}

export interface KernelConfigResponse {
  kernelConfigs: KernelConfig[];
}

export interface HealthResponse {
  message: string;
}
