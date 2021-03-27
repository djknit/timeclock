import React from 'react';
import getStyle from './style';

function InnerAreaHeader({
  label,
  style: styleProp,
  styleVariables: {
    backgroundColor,
    labelEmFontSize,
    dividerColor
  } = {}
}) {

  const style = getStyle(styleProp, { backgroundColor, labelEmFontSize, dividerColor });

  return (
    <div style={style.div}>
      <h3 style={style.text}>
        {label}
      </h3>
      <hr style={style.hr} />
    </div>
  );
}

export default InnerAreaHeader;
