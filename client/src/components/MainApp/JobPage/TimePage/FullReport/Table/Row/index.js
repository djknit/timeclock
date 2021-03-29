import React from 'react';
import getStyle from './style';
import Times from './Times';

function Row({
  hasTimes,
  hasSecondTzCol,
  hasEarningCols,
  rowData: {
    times: {
      sessionTimezone: sessTzTimes,
      officialTimezone: jobTzTimes
    } = {},
    rowLabel,
    duration,
    payRate,
    amountEarned
  }
}) {

  const style = getStyle();

  return (
    <tr>
      <td style={hasTimes ? style.timesTd : style.firstColNoTimes}>
        {hasTimes ? (<Times {...sessTzTimes} />) : rowLabel}
      </td>
      <td style={style.durationTd}>

      </td>
      {hasEarningCols && (
        <>
          <td style={style.payRateTd}>

          </td>
          <td stye={style.amountEarnedTd}>
            
          </td>
        </>
      )}
      {hasSecondTzCol && (
        <td style={hasTimes ? style.timesTd : style.lastColNoTimes}>
          {hasTimes ? (<Times {...jobTzTimes} />) : rowLabel}
        </td>
      )}
    </tr>
  );
}

export default Row;
