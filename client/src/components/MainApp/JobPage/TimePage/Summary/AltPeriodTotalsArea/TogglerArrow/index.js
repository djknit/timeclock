import React from 'react';
import getStyle from './style';
import { keyTriggerCheckerFactory } from '../../../../utilities';
import { addPseudoPseudoClasses } from '../../../../../../higherOrder';

function _TogglerArrow_needsPseudo({
  style: styleProp,
  contentToggle,
  pseudoHandlers,
  pseudoState,
  className
}) {

  const style = getStyle(pseudoState);

  return (
    <i
      className={`fas fa-chevron-up ${className}`}
      style={{ ...styleProp, ...style.arrow}}
      {...pseudoHandlers}
      onClick={contentToggle.toggle}
      tabIndex={0}
      onKeyDown={keyTriggerCheckerFactory(contentToggle.toggle)}
    />
  );
}

const TogglerArrow = addPseudoPseudoClasses(_TogglerArrow_needsPseudo);

export default TogglerArrow;