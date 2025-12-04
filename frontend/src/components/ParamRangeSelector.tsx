import { type FC } from 'react';
import type { ParamRange, ParamRangeType } from '../types';
import { NumericInput } from './NumericInput';

interface RadioGroupOptionProps {
  name: string;
  value: ParamRangeType;
  checked: boolean;
  onSelect: (value: ParamRangeType) => void;
}

const RadioGroupOption: FC<RadioGroupOptionProps> = ({ name, value, checked, onSelect }) => (
  <label className="text-sm pb-2">
    <input className="mr-1" type="radio" name={name} value={value} checked={checked} onChange={() => onSelect(value)} />
    {value}
  </label>
);

export interface ParamRangeSelectorProps {
  paramRange: ParamRange | null;
  onChange: (paramRange: ParamRange) => void;
  label?: string | null;
}

export const ParamRangeSelector: FC<ParamRangeSelectorProps> = ({ paramRange, onChange, label }) => {
  if (!paramRange) return <div />;

  return (
    <div className="flex flex-row">
      {label && <div className="text-m self-center pr-2">{label}:</div>}
      <div className="flex flex-row border-1 border-gray-300 px-2 rounded-sm">
        <NumericInput
          label="start"
          value={paramRange.start}
          max={paramRange.end}
          onChange={(start) => onChange({ ...paramRange, start })}
        />
        <NumericInput
          label="end"
          value={paramRange.end}
          min={paramRange.start}
          onChange={(end) => onChange({ ...paramRange, end })}
        />
        <NumericInput
          label="count"
          value={paramRange.count}
          min={1}
          max={10}
          onChange={(count) => onChange({ ...paramRange, count })}
        />
        <div className="flex flex-col justify-center mt-1 ml-1">
          <RadioGroupOption
            name={`${label}-paramRangeType`}
            value="linear"
            checked={paramRange.type === 'linear'}
            onSelect={(type) => onChange({ ...paramRange, type })}
          />
          <RadioGroupOption
            name={`${label}-paramRangeType`}
            value="log"
            checked={paramRange.type === 'log'}
            onSelect={(type) => onChange({ ...paramRange, type })}
          />
        </div>
      </div>
    </div>
  );
};
