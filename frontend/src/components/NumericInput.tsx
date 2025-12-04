import { type FC } from 'react';

export interface NumericInputProps {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const NumericInput: FC<NumericInputProps> = ({ label, value, onChange, ...rest }) => (
  <label className="text-sm flex flex-col p-2">
    {label}
    <input
      className="w-12 border-1 border-gray-300 rounded-sm my-1 pl-1"
      type="number"
      disabled={value === null}
      onChange={(e) => onChange(Number(e.target.value))}
      value={value === null ? '' : value}
      {...rest}
    />
  </label>
);
