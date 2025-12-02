export interface RidgeResponse {
  message: string;
  ridge_plot: string;
  mse_plot: string;
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
