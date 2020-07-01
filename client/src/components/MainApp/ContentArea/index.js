import React from 'react';
import getStyle, { getTitleStyle } from './style';
import { windowWidthService } from '../../../data';
import { getSizeClass, isWindowWide } from '../utilities';
import { addData } from '../../higherOrder';

const ContentAreaTitle = addData(_ContentAreaTitle_needsData, 'windowWidth', windowWidthService);

function ContentArea({
  children,
  style,
  title
}) {

  const completeStyle = getStyle(style);

  return (
    <section style={completeStyle.section}>
      {title &&
        <ContentAreaTitle>{title}</ContentAreaTitle>
      }
      {children}
    </section>
  );
};

function _ContentAreaTitle_needsData({
  children,
  style,
  size,
  windowWidth
}) {

  let _size = size ? parseInt(size) : 3;
  if (windowWidth && !isWindowWide(windowWidth) && _size < 7) {
    _size += 1;
  }

  const completeStyle = getTitleStyle(style);

  return (
    <h1 className={`title ${getSizeClass(_size)}`} style={completeStyle}>
      {children}
    </h1>
  );
}

export default ContentArea;

export { ContentAreaTitle };