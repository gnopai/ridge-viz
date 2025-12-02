import { type FC } from 'react';

const defaultImgSrc = 'empty_plot.png';

export interface PlotProps {
  title: string;
  imgSrc?: string;
}

export const Plot: FC<PlotProps> = ({ title, imgSrc }) => {
  return (
    <div className="flex flex-col">
      <div className="self-center text-lg font-bold">{title}</div>
      <img src={imgSrc || defaultImgSrc} className="w-lg h-auto"/>
    </div>
  );
};
