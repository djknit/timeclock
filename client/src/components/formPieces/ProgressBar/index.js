import React from 'react';
import getStyle from './style';
import { getColorClass } from '../../utilities';

function ProgressBar({
  theme,
  value,
  max
}) {

  const colorClass = getColorClass(theme);

  const style = getStyle();

  return (
    <progress
      className={`progress ${colorClass}`}
      style={style.progress}
      {...{
        value,
        max
      }}
    ></progress>
  );
}

export default ProgressBar;