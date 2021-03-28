import React from 'react';
import getStyle from './style';
import { getClickableElAttrs } from '../../../../../utilities';
import { addPseudoPseudoClasses } from '../../../../../../../../higherOrder';

function _EarningDetailsToggler_needsPseudo({
  pseudoHandlers,
  pseudoState,
  isVisible,
  disabled,
  earningsContentToggle
}) {

  const style = getStyle(pseudoState, earningsContentToggle.styles);

  return (
    <div
      {...pseudoHandlers}
      {...getClickableElAttrs(earningsContentToggle.toggle, disabled || !isVisible)}
      style={style.togglerArea}
    >
      <i className="fas fa-chevron-up" style={style.arrow} />
      <div style={style.textArea}>
        <span style={style.toggleOpenText}>Show Earnings Details</span>
        <span style={style.toggleClosedText}>Hide Earnings Details</span>
      </div>
    </div>
  );
}

const EarningDetailsToggler = addPseudoPseudoClasses(_EarningDetailsToggler_needsPseudo);

export default EarningDetailsToggler;
