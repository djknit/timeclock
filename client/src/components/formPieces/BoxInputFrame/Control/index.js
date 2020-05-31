import React from 'react';
import getStyle from './style';
import { windowWidthService } from '../../../../data';
import { addData } from '../../../higherOrder';

function _Control_needsData({
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
  const completeStyle = getStyle(style, isRadio, windowWidth);

  return (
    <div className={className} style={completeStyle.control}>
      {children}
    </div>
  );
}

const Control = addData(_Control_needsData, 'windowWidth', windowWidthService);

export default Control;