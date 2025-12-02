export interface RidgeResponse {
  results: RidgeResult[];
  message: string;
}

export interface RidgeResult {
  lambdas: number;
  runs: number;
  kernelName: string;
  kernelParamName: string | null;
  kernelParamValue: number | null;
  overallMSE: number;
  ridgePlot: string;
  msePlot: string;
}

export interface RidgeRequest {
  kernels: KernelConfig[];
  lambdas: number[];
  runs: number;
}

export interface KernelConfig {
  name: string;
  paramName: string | null;
  paramValue: number | null;
}

export interface KernelConfigResponse {
  kernelConfigs: KernelConfig[];
}

export interface HealthResponse {
  message: string;
}
