import React from 'react';
import getStyle from './style';
import { getColorClass } from '../../utilities';

function ProgressBar({
  theme,
  value,
  max = 100,
  remaining
}) {

  const colorClass = getColorClass(theme);

  const style = getStyle();

  return (
    <progress
      className={`progress ${colorClass}`}
      style={style.progress}
      {...{ max }}
      value={remaining ? (max - remaining) : value}
    />
  );
}

export default ProgressBar;