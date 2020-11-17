import React from 'react';
import getStyle from './style';
import { roundNumToNDecimalDigits } from '../../../../utilities';
import { addPseudoPseudoClasses } from '../../../../../../higherOrder';
import EarningDetailsToggle from './EarningDetailsToggle';

function _Totals_needsPseudo({
  periodTotals,
  earningsContentToggle,
  mainContentToggle
}) {

  const { totalTime, daysWorked, earnings, firstDate, lastDate } = periodTotals;
  
  const style = getStyle();

  return (
    <>
      <p style={style.basicsP}>
        <strong>{getTotalTimeDisplay(totalTime)}</strong> worked on {getDaysWorkedDisplay(daysWorked)}
      </p>
      <p style={style.basicsP}>
        Earnings: {getEarningsSummaryDisplay(earnings)}
      </p>
      <EarningDetailsToggle
        {...{ earningsContentToggle }}
        isVisible={mainContentToggle.isExpanded}
      />
      <div
        style={{ ...earningsContentToggle.styles.container, ...style.earningsDetails }}
        ref={earningsContentToggle.containerRef}
      >
        <p style={style.basicsP}>test</p>
        <p style={style.basicsP}>test</p>
        <p style={style.basicsP}>test</p>
      </div>
    </>
  );
}

const Totals = addPseudoPseudoClasses(_Totals_needsPseudo);

export default Totals;

function getTotalTimeDisplay(totalTime) {
  const numHrs = roundNumToNDecimalDigits(totalTime.durationInHours, 2);
  return `${numHrs} hours`;
}

function getDaysWorkedDisplay(daysWorked) {
  let dispText = `${daysWorked} day`;
  if (daysWorked !== 1) dispText += 's';
  return dispText;
}

function getEarningsSummaryDisplay(earnings) {
  if (!earnings) return 'none';
  return earnings.map(
    ({ amount, currency }, index, arr) => (
      <React.Fragment key={currency}>
        <><strong>{amount.display.long}</strong>{getListSeparator(index, arr.length)}</>
      </React.Fragment>
    )
  );
}

function getListSeparator(index, listLength) { // for separator following current element
  if (index < listLength - 2) return ', ';
  else if (index === 0 && listLength === 2) return ' and ';
  else if (index === listLength - 2) return ', and ';
  else return '';
}
