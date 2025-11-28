export interface RidgePlotResponse {
  message: string;
  img_src: string;
}

export interface RidgePlotRequest {
  kernel: string;
  kernelParamName: string | null;
  kernelParamValue: number | null;
  lambda: number;
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
