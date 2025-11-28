import { type FC } from 'react';

export interface NumericInputProps {
  value: number | null;
  onChange: (value: number) => void;
}

// TODO label
export const NumericInput: FC<NumericInputProps> = ({ value, onChange }) => (
  <input
    className="w-12"
    type="number"
    disabled={value === null}
    onChange={(e) => onChange(Number(e.target.value))}
    value={value === null ? '' : value}
  />
);
