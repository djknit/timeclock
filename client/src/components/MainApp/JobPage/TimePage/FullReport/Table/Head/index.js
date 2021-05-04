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
  hasEarningCols,
  hasSecondaryTzTimes,
  colRefs,
  colWidths,
  style: styleProp
}) {

  let firstColLabel, lastColLabel;

  if (hasTimes) {
    firstColLabel = (
      primaryTzLabel ||
      `Times (${getTimezoneAbbreviation(primaryTimezone, date)})`
    );
    lastColLabel = (
      secondaryTzLabel ||
      `Job Timezone (${getTimezoneAbbreviation(secondaryTimezone, date)})`
    );
  }

  const style = getStyle(styleProp, colWidths);

  return (
    <thead>
      <tr style={style.tr}>
        <th style={style.timesTh} ref={colRefs.times}>
          {firstColLabel}
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
        {hasSecondTzCol && (
          <th style={style.secondaryTzTimesTh} ref={colRefs.secondaryTzTimes}>
            {hasSecondaryTzTimes && (
              lastColLabel
            )}
          </th>
        )}
      </tr>
    </thead>
  );
}

export default Thead;
