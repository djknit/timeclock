import React from 'react';
import getStyle from './style';
import { keyTriggerCheckerFactory } from '../../../../utilities';
import { addPseudoPseudoClasses } from '../../../../../../higherOrder';

function _Footer_needsPseudo({
  toggle, // function
  toggleStyles,
  pseudoHandlers,
  pseudoState
}) {

  const style = getStyle(pseudoState);
  
  return (
    <div style={style.div}>
      <hr style={style.footerHr} />
      <i
        className="fas fa-chevron-up"
        style={{ ...toggleStyles.toggle, ...style.togglerArrow }}
        {...pseudoHandlers}
        onClick={toggle}
        tabIndex={0}
        onKeyDown={keyTriggerCheckerFactory(toggle)}
      />
    </div>
  );
}

const Footer = addPseudoPseudoClasses(_Footer_needsPseudo);

export default Footer;
