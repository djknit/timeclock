import React from 'react';
import getStyle from './style';

function Label({
  children
}) {
  const style = getStyle();
  return (
    <><span style={style.valueLabel}>{children}</span>{' '}</>
  );
}

function EmVal({ children }) {
  const style = getStyle();
  return (
    <span style={style.emphasizedValue}>{children}</span>
  );
}

export { Label, EmVal };
