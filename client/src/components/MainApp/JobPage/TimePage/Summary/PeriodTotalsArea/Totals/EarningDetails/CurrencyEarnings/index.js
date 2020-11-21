import React from 'react';
import getStyle from './style';
import { getCurrencyName, getHoursDurationDisplay } from '../../utilities';
import { Label } from '../../smallPieces';
import Rates from '../Rates';

function CurrencyEarnings({
  earningsForCurrency
}) {

  const { amount, currency, rates, totalTime } = earningsForCurrency;

  const style = getStyle();

  return (
    <div style={style.currencyDetailsArea}>
      <p style={style.areaLabel}>
        <Label>{getCurrencyName(currency)} Earnings:</Label>
      </p>
      <p style={style.p}>
        <Label>Total Time:</Label>
        {getHoursDurationDisplay(totalTime)}
      </p>
      <p style={style.p}>
        <Label>Total Earned:</Label>
        {amount.display.standard}
      </p>
      <Rates earningsByRate={rates} isDoubleEmbedded />
    </div>
  );
}

export default CurrencyEarnings;
