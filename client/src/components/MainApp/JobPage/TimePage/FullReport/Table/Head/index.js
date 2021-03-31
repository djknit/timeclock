import React from 'react';
import getStyle from './style';
import { getTimezoneAbbreviation } from '../utilities';

function Thead({
  hasTimes,
  primaryTimezone,
  secondaryTimezone,
  primaryTzLabel,
  secondaryTzLabel,
  date,
  hasSecondTzCol,
  hasEarningCols
}) {

  let firstColLabel, lastColLabel;

  if (hasTimes) {
    firstColLabel = (
      primaryTzLabel ||
      `Times (${getTimezoneAbbreviation(primaryTimezone)})`
    );
    lastColLabel = (
      secondaryTzLabel ||
      `Job Timezone (${getTimezoneAbbreviation(secondaryTimezone, date)})`
    );
  }

  const style = getStyle();

  return (
    <thead>
      <tr>
        <th style={style.timesTh}>
          {firstColLabel}
        </th>
        <th style={style.numAmountColTh}>
          Hours Worked
        </th>
        {hasEarningCols && (
          <>
            <th style={style.numAmountColTh}>
              Pay Rate
            </th>
            <th style={style.numAmountColTh}>
              Amount Earned
            </th>
          </> 
        )}
        {hasSecondTzCol && (
          <th style={style.timesTh}>
            {lastColLabel}
          </th>
        )}
      </tr>
    </thead>
  );
}

export default Thead;
