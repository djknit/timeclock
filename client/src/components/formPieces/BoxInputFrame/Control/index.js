import React from 'react';
import getStyle from './style';

function Control({
  isInline,
  hasIcon,
  children,
  style,
  isRadio,
  windowWidth
}) {

  let className = 'control';
  if (isInline) className += ' is-expanded';
  if (hasIcon) {
    className += hasIcon === 'right' ?
      ' has-icons-right' :
      ' has-icons-left';
  }
  const completeStyle = getStyle(style, isRadio, isInline, windowWidth);

  return (
    <div className={className} style={completeStyle.control}>
      {children}
    </div>
  );
}

export default Control;