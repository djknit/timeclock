import React from 'react';
import getStyle from './style';
import { getTimezoneAbbreviation } from '../utilities';

function Thead({
  hasTimes,
  primaryTimezone,
  primaryTzLabel,
  date,
  hasEarningCols,
  hasSecondaryTzTimes,
  colRefs,
  colWidths,
  style: styleProp
}) {

  const defaultTimeColLabel = hasTimes && (
    'Times' + (hasSecondaryTzTimes ? ` (${getTimezoneAbbreviation(primaryTimezone, date)})` : '')
  );

  const style = getStyle(styleProp, colWidths);

  return (
    <thead>
      <tr style={style.tr}>
        <th style={style.timesTh} ref={colRefs.times}>
          {primaryTzLabel || defaultTimeColLabel}
        </th>
        <th style={style.durationTh} ref={colRefs.duration}>
          Hours Worked
        </th>
        {hasEarningCols && (
          <>
            <th style={style.payRateTh} ref={colRefs.payRate}>
              Pay Rate
            </th>
            <th style={style.amountEarnedTh} ref={colRefs.amountEarned}>
              Amount Earned
            </th>
          </> 
        )}
      </tr>
    </thead>
  );
}

export default Thead;
