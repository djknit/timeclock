import React from 'react';
import getStyle from './style';
import { keyTriggerCheckerFactory } from '../../../../utilities';
import { addPseudoPseudoClasses } from '../../../../../../higherOrder';

function _Totals_needsPseudo({
  periodTotals,
  earningsContentToggle,
  pseudoState: arrowPseudoState,
  pseudoHandlers: arrowPseudoHandlers,
  mainContentToggle
}) {

  const { totalTime, daysWorked, earnings, firstDate, lastDate } = periodTotals;
  
  const style = getStyle();

  const toggleEarningsDetails = () => {
    earningsContentToggle.toggle();
    mainContentToggle.allowChildToggle();
  };

  return (
    <>
      <p>__test</p>
      <p>__test</p>
      <div
        style={{ ...earningsContentToggle.styles.container, ...style.earningsDetails }}
        ref={earningsContentToggle.containerRef}
      >
        <p>test</p>
        <p>test</p>
        <p>test</p>
      </div>
      <i
        className="fas fa-chevron-up"
        style={earningsContentToggle.styles.toggle}
        {...arrowPseudoHandlers}
        onClick={toggleEarningsDetails}
        tabIndex={0}
        onKeyDown={keyTriggerCheckerFactory(toggleEarningsDetails)}
      />
    </>
  );
}

const Totals = addPseudoPseudoClasses(_Totals_needsPseudo);

export default Totals;