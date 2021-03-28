import React from 'react';
import getStyle from './style';
import * as styles from './style';
export { styles };

function InnerAreaHeader({
  label,
  style: styleProp,
  styleVariables: {
    backgroundColor,
    labelEmFontSize,
    dividerColor
  } = {},
  children
}) {

  const style = getStyle(styleProp, { backgroundColor, labelEmFontSize, dividerColor });

  return (
    <div style={style.div}>
      <h3 style={style.text}>
        {label}
      </h3>
      <hr style={style.hr} />
      {children}
    </div>
  );
}

export default InnerAreaHeader;
