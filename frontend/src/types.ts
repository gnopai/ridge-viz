export interface RidgeResponse {
  message: string;
  ridge_plot: string;
  mse_plot: string;
}

export interface RidgeRequest {
  kernel: string;
  kernelParamName: string | null;
  kernelParamValue: number | null;
  lambda: number;
  runs: number;
}

export interface KernelConfig {
  name: string;
  param: string | null;
  paramDefault: number | null;
}

export interface KernelConfigResponse {
  kernelConfigs: KernelConfig[];
}

export interface HealthResponse {
  message: string;
}
