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
  isFirstInGroup,
  date,
  colWidths
}) {

  const commonTimesAttrs = { dayDate: date };

  const style = getStyle(styleProp, colWidths, isFirstInGroup);

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
        amountEarned ? (
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
        <td style={style.secondaryTzTimes}>
          {hasTimes && hasSecondaryTzTimes && (
            <Times {...jobTzTimes} {...commonTimesAttrs} />
          )}
        </td>
      )}
    </tr>
  );
}

export default Row;
