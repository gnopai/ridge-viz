import { type FC } from 'react';
import type { KernelConfig } from '../types';

export interface KernelSelectorProps {
  kernelConfigs: KernelConfig[];
  onSelectKernel: (config: KernelConfig | null) => void;
}

export const KernelSelector: FC<KernelSelectorProps> = ({ kernelConfigs, onSelectKernel }) => {
  const onSelect = (value: string) => {
    const kernelName = value + 'Kernel';
    const kernelConfig = kernelConfigs.find((kernel) => kernel.name === kernelName) || null;
    onSelectKernel(kernelConfig);
  };

  const kernelNames = kernelConfigs.map((config) => config.name.replace(/Kernel$/, ''));

  return (
    <select
      className="p-2 text-lg mr-2.5 border-2 border-bg-gray-500 rounded"
      onChange={(e) => onSelect(e.target.value)}
    >
      {kernelNames.map((kernel) => (
        <option key={kernel} value={kernel}>
          {kernel}
        </option>
      ))}
    </select>
  );
};
