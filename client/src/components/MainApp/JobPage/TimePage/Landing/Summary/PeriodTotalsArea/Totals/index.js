import React from 'react';
import getStyle from './style';
import { formatMyDate, getListSeparator, getHoursDurationDisplay } from './utilities';
import { addPseudoPseudoClasses } from '../../../../../../../higherOrder';
import EarningDetailsToggle from './EarningDetailsToggle';
import EarningDetails from './EarningDetails';
import { Label, EmVal } from './smallPieces';

function _Totals_needsPseudo({
  periodTotals,
  earningsContentToggle,
  mainContentToggle,
  disabled
}) {

  const {
    totalTime, daysWorked, earnings, firstDate, lastDate, paidTime, unpaidTime
  } = periodTotals;

  const style = getStyle();

  const totalTimeDisp = getHoursDurationDisplay(totalTime);
  const daysWorkedDisp = getDaysWorkedDisplay(daysWorked);

  return (
    <>
      {firstDate && (
        <p style={style.detailsP}>
          ({formatMyDate(firstDate)} &ndash; {formatMyDate(lastDate)})
        </p>
      )}
      <p style={style.basicsP}>
        <EmVal>{totalTimeDisp}</EmVal> worked on {daysWorkedDisp}
      </p>
      <p style={style.basicsP}>
        <Label>Earnings:</Label> {getEarningsSummaryDisplay(earnings)}
      </p>
      {earnings && (
        <>
          <EarningDetailsToggle
            {...{
              earningsContentToggle,
              disabled
            }}
            isVisible={mainContentToggle.isExpanded}
          />
          <div
            style={{ ...earningsContentToggle.styles.container, ...style.earningsDetailsArea }}
            ref={earningsContentToggle.containerRef}
          >
            <EarningDetails {...{ earnings, paidTime, unpaidTime, firstDate }} />
          </div>
        </>
      )}
    </>
  );
}

const Totals = addPseudoPseudoClasses(_Totals_needsPseudo);

export default Totals;

function getDaysWorkedDisplay(daysWorked) {
  let dispText = `${daysWorked} day`;
  if (daysWorked !== 1) dispText += 's';
  return dispText;
}

function getEarningsSummaryDisplay(earnings) {
  if (!earnings) return 'none';
  return earnings.filter(
    ({ currency }) => !!currency
  ).map(
    ({ amount, currency }, index, arr) => (
      <React.Fragment key={currency}>
        <><EmVal>{amount.display.long}</EmVal>{getListSeparator(index, arr.length)}</>
      </React.Fragment>
    )
  );
}
