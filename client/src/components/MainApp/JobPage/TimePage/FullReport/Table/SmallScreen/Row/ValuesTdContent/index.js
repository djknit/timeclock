import React from 'react';
import {
  formatDurationForReportTable, formatPayRateForReportTable, formatAmountEarnedForReportTable
} from '../../utilities';
import TdDropDown from '../../../DropDown';

function ValuesTdContent({
  valueRightStyle,
  valuesRightRefs,
  duration,
  payRate,
  amountEarned,
  ...otherProps
}) {

  const hasPayRateAndAmount = !!(payRate && amountEarned);

  const durationDisp = formatDurationForReportTable(duration, undefined, true);
  const payRateDisp = formatPayRateForReportTable(payRate, true, hasPayRateAndAmount);
  const amountEarnedDisp = formatAmountEarnedForReportTable(amountEarned, true, hasPayRateAndAmount);

  const AmountValue = getAmountValComp(valueRightStyle);

  return (
    <>
      <AmountValue rightRef={valuesRightRefs.duration} splitDisp={durationDisp} />
      {(payRate || amountEarned) && (
        <TdDropDown {...otherProps}>
          <AmountValue rightRef={valuesRightRefs.payRate} splitDisp={payRateDisp} />
          {payRate && amountEarned && <br />}
          <AmountValue rightRef={valuesRightRefs.amountEarned} splitDisp={amountEarnedDisp} />
        </TdDropDown>
      )}
    </>
  );
}

export default ValuesTdContent;


function getAmountValComp(rightStyle) {
  return function AmountValue({
    rightRef,
    splitDisp
  }) {
    return splitDisp ? (
      <>
        {
          splitDisp[0]
        }.{
          <span ref={rightRef} style={rightStyle} children={splitDisp[1]} />
        }
      </>
    ) : (
      null
    );
  };
}
