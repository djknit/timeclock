import React from 'react';
import getStyle, { getStyleVars } from './style';
import InnerAreaHeader from '../../../../InnerAreaHeader';

function Header({ label }) {

  const style = getStyle();

  const styleVariables = getStyleVars();

  return (
    <InnerAreaHeader {...{ label, styleVariables, style }} />
  );
}

export default Header;
