import React from 'react';
import getStyle from './style';
import { getHoursDurationDisplay } from '../../utilities';
import { Label } from '../../smallPieces';

function Rates({
  earningsByRate,
  isDoubleEmbedded
}) {

  const style = getStyle(isDoubleEmbedded);

  return (
    <div style={style.area}>
      <p style={style.areaLabel}>
        <Label>Earnings By Pay Rate:</Label>
      </p>
      {earningsByRate.map(
        ({ rate, amountEarned, duration, isOvertime }, index, arr) => (
          <p
            style={index === arr.length - 1 ? style.lastP : style.p}
            key={getRateUniqueId({ rate, isOvertime })}
          >
            <Label>{rate.display.standard} / hr:</Label>
            {getHoursDurationDisplay(duration)} worked, {amountEarned.display.standard} earned
          </p>
        )
      )}
    </div>
  );
}

export default Rates;

function getRateUniqueId({ rate, isOvertime }) {
  let id = rate.display.numeric;
  if (isOvertime) id += 'ot';
  return id;
  // potential issue: could be non-unique if 2 wages have the same rate
}
