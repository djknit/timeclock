import React from 'react';
import getStyle from './style';

function ProgressBar({
  color,
  value,
  max
}) {

  const colorClass = color ? `is-${color}` : '';

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