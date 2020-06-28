import React from 'react';
import { addPseudoPseudoClasses, calculateStyleForPseudoClassState } from '../higherOrder';

function _OutsideLink_neeedsPseudo({
  styles,
  href,
  children,
  pseudoState,
  pseudoHandlers,
  allowTabFocus
}) {

  const style = calculateStyleForPseudoClassState(styles, pseudoState);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...pseudoHandlers}
      style={style}
      tabIndex={allowTabFocus === false ? -1 : 0}
    >
      {children}
    </a>
  );
}

const OutsideLink = addPseudoPseudoClasses(_OutsideLink_neeedsPseudo);

export default OutsideLink;