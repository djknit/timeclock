import React from 'react';
import getStyle from './style';
import { keyTriggerCheckerFactory, roundNumToNDecimalDigits, getCurrencyAmountInfo } from '../../../../utilities';
import { addPseudoPseudoClasses } from '../../../../../../higherOrder';
import EarningDetailsToggle from './EarningDetailsToggle';

function _Totals_needsPseudo({
  periodTotals,
  earningsContentToggle,
  pseudoState: arrowPseudoState,
  pseudoHandlers: arrowPseudoHandlers,
  mainContentToggle
}) {

  // console.log(periodTotals)

  const { totalTime, daysWorked, earnings, firstDate, lastDate } = periodTotals;
  
  const style = getStyle(arrowPseudoState);

  const toggleEarningsDetails = () => {
    mainContentToggle.toggleChild(earningsContentToggle);
  };

  return (
    <>
      <p><strong>{getTotalTimeDisplay(totalTime)}</strong> worked on {getDaysWorkedDisplay(daysWorked)}</p>
      <p>Earnings: {getEarningsSummaryDisplay(earnings)}</p>
      <EarningDetailsToggle
        toggle={toggleEarningsDetails}
        toggleStyles={earningsContentToggle.styles}
      />
      <div
        style={{ ...earningsContentToggle.styles.container, ...style.earningsDetails }}
        ref={earningsContentToggle.containerRef}
      >
        <p>test</p>
        <p>test</p>
        <p>test</p>
      </div>
      {/* <p></p> */}
      {/* <i
        className="fas fa-chevron-up"
        style={{ ...earningsContentToggle.styles.toggle, ...style.detailsTogglerArrow }}
        {...arrowPseudoHandlers}
        onClick={toggleEarningsDetails}
        tabIndex={0}
        onKeyDown={keyTriggerCheckerFactory(toggleEarningsDetails)}
      /> */}
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
  const _earnings = earnings.map(el => el);
  _earnings.push({
    amount: getCurrencyAmountInfo(4.2, 'EUR'),
    currency: 'EUR'
  });
  return _earnings.map(
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
