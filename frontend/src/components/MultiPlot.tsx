import { useState, type FC } from 'react';
import Switch from 'react-switch';
import { Plot } from './Plot';
import type { RidgeResult } from '../types';

export interface MultiPlotProps {
  title: string;
  ridgeResult: RidgeResult | null;
}

export const MultiPlot: FC<MultiPlotProps> = ({ title, ridgeResult }) => {
  const [showProcess, setShowProcess] = useState<boolean>(false);
  const [showModel, setShowModel] = useState<boolean>(false);

  const { ridgeFullPlot, ridgeProcessPlot, ridgeModelPlot, ridgeSamplesPlot } = ridgeResult || {};
  const plot =
    showProcess && showModel
      ? ridgeFullPlot
      : showProcess
        ? ridgeProcessPlot
        : showModel
          ? ridgeModelPlot
          : ridgeSamplesPlot;

  return (
    <div>
      <Plot title={title} imgSrc={plot} />
      <div className="flex flex-row">
        <label>
          <span>Process</span>
          <Switch onChange={(checked) => setShowProcess(checked)} checked={showProcess} />
        </label>
        <label>
          <span>Model</span>
          <Switch onChange={(checked) => setShowModel(checked)} checked={showModel} />
        </label>
      </div>
    </div>
  );
};
