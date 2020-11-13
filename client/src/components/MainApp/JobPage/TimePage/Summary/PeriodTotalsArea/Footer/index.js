import React from 'react';
import getStyle from './style';
import { keyTriggerCheckerFactory } from '../../../../utilities';
import { addPseudoPseudoClasses } from '../../../../../../higherOrder';

function _Footer_needsPseudo({
  mainContentToggle,
  pseudoHandlers,
  pseudoState
}) {

  const style = getStyle(mainContentToggle.styles, pseudoState);
  
  return (
    <div style={style.div}>
      <hr style={style.footerHr} />
      <i
        className="fas fa-chevron-up"
        style={style.togglerArrow}
        {...pseudoHandlers}
        onClick={mainContentToggle.toggle}
        tabIndex={0}
        onKeyDown={keyTriggerCheckerFactory(mainContentToggle.toggle)}
      />
    </div>
  );
}

const Footer = addPseudoPseudoClasses(_Footer_needsPseudo);

export default Footer;