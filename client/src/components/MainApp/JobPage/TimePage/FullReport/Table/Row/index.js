import React from 'react';
import {
  formatDurationForReportTable,
  formatAmountEarnedForReportTable,
  formatPayRateForReportTable
} from '../utilities';
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
    amountEarned,
    payRate,
    // _id, // segment id; only defined for rows that represent segments; not currently needed.
    style: styleProp
  },
  isTotal,
  isFirstInGroup
}) {

  const style = getStyle(styleProp);

  return (
    <tr style={style.tr}>
      <td style={hasTimes ? style.timesTd : style.firstColNoTimes}>
        {hasTimes ? (
          <Times {...sessTzTimes} />
        ) : (
          rowLabel
        )}
      </td>
      <td style={style.durationTd}>
        {formatDurationForReportTable(duration)}
      </td>
      {hasEarningCols && (
        <>
          <td style={style.payRateTd}>
            {formatPayRateForReportTable(payRate)}
          </td>
          <td style={style.amountEarnedTd}>
            {formatAmountEarnedForReportTable(amountEarned)}
          </td>
        </>
      )}
      {hasSecondTzCol && (
        <td style={hasTimes ? style.timesTd : style.lastColNoTimes}>
          {hasTimes && (
            <Times {...jobTzTimes} />
          )}
        </td>
      )}
    </tr>
  );
}

export default Row;
