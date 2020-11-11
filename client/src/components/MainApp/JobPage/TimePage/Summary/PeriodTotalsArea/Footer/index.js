import React from 'react';
import getStyle from './style';
import { keyTriggerCheckerFactory } from '../../../../utilities';

function Footer({
  mainContentToggle,
  arrowPseudoHandlers,
  arrowPseudoState
}) {

  const style = getStyle(mainContentToggle.styles, arrowPseudoState);
  
  return (
    <div style={style.div}>
      <hr style={style.footerHr} />
      <i
        className="fas fa-chevron-up"
        style={style.togglerArrow}
        {...arrowPseudoHandlers}
        onClick={mainContentToggle.toggle}
        tabIndex={0}
        onKeyDown={keyTriggerCheckerFactory(mainContentToggle.toggle)}
      />
    </div>
  );
}

export default Footer;