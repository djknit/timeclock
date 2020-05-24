import React, { Component } from 'react';
import getStyle from './style';
import { addPseudoPseudoClasses} from '../higherOrder';

function _OutsideLink_neeedsPseudo({
  styles,
  href,
  children,
  pseudoState,
  pseudoHandlers
}) {

  const style = getStyle(styles, pseudoState);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...pseudoHandlers}
      style={style}
    >
      {children}
    </a>
  );
}

const OutsideLink = addPseudoPseudoClasses(_OutsideLink_neeedsPseudo);

export default OutsideLink;