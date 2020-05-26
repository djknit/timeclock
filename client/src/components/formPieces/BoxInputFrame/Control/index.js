import React from 'react';

function Control({
  isInline,
  hasIcon,
  children,
  style
}) {

  let className = 'control';
  if (isInline) className += ' is-expanded';
  if (hasIcon) {
    className += hasIcon === 'right' ?
      ' has-icons-right' :
      ' has-icons-left';
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export default Control;