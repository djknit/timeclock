import React from 'react';
import getStyle from './style';
import { keyTriggerCheckerFactory } from '../../../../utilities';
import { addPseudoPseudoClasses } from '../../../../../../higherOrder';

function _Footer_needsPseudo({
  contentToggle,
  pseudoHandlers,
  pseudoState
}) {

  const style = getStyle(pseudoState);
  
  return (
    <div style={style.div}>
      <hr style={style.footerHr} />
      <i
        className="fas fa-chevron-up"
        style={{ ...contentToggle.styles.toggle, ...style.togglerArrow }}
        {...pseudoHandlers}
        onClick={contentToggle.toggle}
        tabIndex={0}
        onKeyDown={keyTriggerCheckerFactory(contentToggle.toggle)}
      />
    </div>
  );
}

const Footer = addPseudoPseudoClasses(_Footer_needsPseudo);

export default Footer;
