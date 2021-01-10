import React from 'react';
import getStyle from './style';
import { getHoursDurationDisplay } from '../utilities';
import { Label } from '../smallPieces';
import CurrencyEarnings from './CurrencyEarnings';
import Rates from './Rates';

function EarningDetails({
  earnings,
  paidTime,
  unpaidTime
}) {

  const style = getStyle();

  const _paidEarnings = earnings.filter(({ currency }) => !!currency);

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
      {_paidEarnings.length > 1 ? (
        _paidEarnings.map(earningsForCurrency => (
          <CurrencyEarnings {...{ earningsForCurrency }} />
        ))
      ) : (
        <Rates earningsByRate={_paidEarnings[0].rates} />
      )}
    </>
  );
}

export default EarningDetails;
