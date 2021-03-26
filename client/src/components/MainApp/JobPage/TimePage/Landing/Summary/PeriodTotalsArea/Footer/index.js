import React from 'react';
import getStyle from './style';
import { getClickableElAttrs } from '../../../../utilities';
import { addPseudoPseudoClasses } from '../../../../../../../higherOrder';

function _Footer_needsPseudo({
  contentToggle,
  pseudoHandlers,
  pseudoState,
  disabled
}) {

  const style = getStyle(pseudoState);
  
  return (
    <div style={style.div}>
      <hr style={style.footerHr} />
      <i
        className="fas fa-chevron-up"
        style={{ ...contentToggle.styles.toggle, ...style.togglerArrow }}
        {...pseudoHandlers}
        {...getClickableElAttrs(contentToggle.toggle, disabled)}
      />
    </div>
  );
}

const Footer = addPseudoPseudoClasses(_Footer_needsPseudo);

export default Footer;
