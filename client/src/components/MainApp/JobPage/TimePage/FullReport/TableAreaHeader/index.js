import React from 'react';
import getStyle, { headingStyleVars } from './style';
import InnerAreaHeader from '../../InnerAreaHeader';

function Day({
  label
}) {

  const style = getStyle();
  
  return (
    <InnerAreaHeader
      {...{ label }}
      style={style.heading}
      ranking={3}
      styleVariables={headingStyleVars}
    />
  );
}

export default Day;
