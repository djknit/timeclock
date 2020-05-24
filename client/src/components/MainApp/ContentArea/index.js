import React from 'react';
import getStyle, { getTitleStyle } from './style';

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

function ContentAreaTitle({
  children,
  style,
  size
}) {

  let className = 'title';
  if (size) className += ` is-size-${size}`

  const completeStyle = getTitleStyle(style);

  return (
    <h1 className={className} style={completeStyle}>
      {children}
    </h1>
  );
}

export default ContentArea;

export { ContentAreaTitle };