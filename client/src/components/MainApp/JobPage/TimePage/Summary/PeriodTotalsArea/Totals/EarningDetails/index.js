import React from 'react';
import getStyle from './style';
import { getHoursDurationDisplay } from '../utilities';
import { Label, EmVal } from '../smallPieces';
import CurrencyEarnings from './CurrencyEarnings';
import Rates from './Rates';

function EarningDetails({
  earnings,
  paidTime,
  unpaidTime
}) {

  console.log(earnings)

  const style = getStyle();

  return (
    <>
      <p style={style.firstTotalsP}>
        <Label>Total Paid Time:</Label> 
        {getHoursDurationDisplay(paidTime)}
      </p>
      <p style={style.lastTotalsP}>
        <Label>Total Unpaid Time:</Label>
        {getHoursDurationDisplay(unpaidTime)}
      </p>
      {earnings.length > 1 ? ( // needs changed to "> 1"
        earnings.map(earningsForCurrency => (
          <CurrencyEarnings {...{ earningsForCurrency }} />
        ))
      ) : (
        <Rates earningsByRate={earnings[0].rates} />
      )}
    </>
  );
}

export default EarningDetails;
