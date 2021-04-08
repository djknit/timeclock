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
  hasSecondaryTzTimes,
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
  // isTotal,
  isFirstInGroup,
  date
}) {

  const commonTimesAttrs = { dayDate: date };

  const style = getStyle(styleProp, isFirstInGroup);

  return (
    <tr style={style.tr}>
      <td style={hasTimes ? style.timesTd : style.firstColNoTimes}>
        {(hasTimes && (
          <Times {...sessTzTimes} {...commonTimesAttrs} />
        )) ||
        (rowLabel && (
          <>{rowLabel}:</>
        ))}
      </td>
      <td style={style.durationTd}>
        {formatDurationForReportTable(duration)}
      </td>
      {hasEarningCols && (
        payRate ? (
          <>
            <td style={style.payRateTd}>
              {formatPayRateForReportTable(payRate)}
            </td>
            <td style={style.amountEarnedTd}>
              {formatAmountEarnedForReportTable(amountEarned)}
            </td>
          </>
        ) : (
          <>
            <td style={style.payRateTdUnpaid}>
              {payRate === null && (
                <> &mdash; </>
              )}
            </td>
            <td style={style.amountEarnedTdUnpaid}>
              {amountEarned === null && (
                <> &mdash; </>
              )} 
            </td>
          </>
        )
      )}
      {hasSecondTzCol && (
        <td style={hasTimes ? style.timesTd : style.lastColNoTimes}>
          {hasTimes && hasSecondaryTzTimes && (
            <Times {...jobTzTimes} {...commonTimesAttrs} />
          )}
        </td>
      )}
    </tr>
  );
}

export default Row;
