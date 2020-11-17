import React from 'react';
import getStyle from './style';
import { roundNumToNDecimalDigits, getListSeparator, formatMyDate } from './utilities';
import { addPseudoPseudoClasses } from '../../../../../../higherOrder';
import EarningDetailsToggle from './EarningDetailsToggle';
import EarningDetails from './EarningDetails';

function _Totals_needsPseudo({
  periodTotals,
  earningsContentToggle,
  mainContentToggle
}) {

  const { totalTime, daysWorked, earnings, firstDate, lastDate } = periodTotals;
  
  const style = getStyle();

  return (
    <>
      {firstDate && (
        <p style={style.detailsP}>
          ({formatMyDate(firstDate)} &ndash; {formatMyDate(lastDate)})
        </p>
      )}
      <p style={style.basicsP}>
        <strong>{getTotalTimeDisplay(totalTime)}</strong> worked on {getDaysWorkedDisplay(daysWorked)}
      </p>
      <p style={style.basicsP}>
        Earnings: {getEarningsSummaryDisplay(earnings)}
      </p>
      {earnings && (
        <>
          <EarningDetailsToggle
            {...{ earningsContentToggle }}
            isVisible={mainContentToggle.isExpanded}
          />
          <div
            style={{ ...earningsContentToggle.styles.container, ...style.earningsDetails }}
            ref={earningsContentToggle.containerRef}
          >
            <EarningDetails {...{ earnings }} />
          </div>
        </>
      )}
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
