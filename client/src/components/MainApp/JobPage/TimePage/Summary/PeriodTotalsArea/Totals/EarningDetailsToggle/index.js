import React from 'react';
import getStyle from './style';
import { keyTriggerCheckerFactory } from '../../../../../utilities';
import { addPseudoPseudoClasses } from '../../../../../../../higherOrder';

function _EarningDetailsToggler_needsPseudo({
  pseudoHandlers,
  pseudoState,
  isVisible,
  earningsContentToggle
}) {

  const style = getStyle(pseudoState, earningsContentToggle.styles);

  return (
    <div
      {...pseudoHandlers}
      onClick={earningsContentToggle.toggle}
      tabIndex={isVisible ? 0 : -1}
      onKeyDown={keyTriggerCheckerFactory(earningsContentToggle.toggle)}
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
