import { type FC } from 'react';
import type { RidgeResult } from '../types';
import { isNil } from 'lodash';

export interface PlotSelectorProps {
  results?: RidgeResult[];
  onSelect: (result: RidgeResult) => void;
}

const formatItem = (label?: string | null, value?: number | null) => {
  if (!label || isNil(value)) return '';
  return `${label} = ${value.toPrecision(4)}`;
};

export const PlotSelector: FC<PlotSelectorProps> = ({ results, onSelect }) => {
  if (!results?.length) return null;

  const options = results.map((result, i) => {
    const label = [
      formatItem(result.kernelParamName, result.kernelParamValue),
      formatItem('lambda', result.lambda),
      formatItem('MSE', result.overallMSE),
    ]
      .filter((l) => l)
      .join(', ');
    return {
      key: `result-${i}`,
      value: i,
      label,
    };
  });

  return (
    <select
      className="max-h-[50px] max-w-fit p-2 text-lg mr-2.5 border-2 border-bg-gray-500 rounded"
      onChange={(e) => onSelect(results[parseInt(e.target.value)])}
    >
      {options.map(({ key, value, label }) => (
        <option key={key} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
