import React from 'react';
import {
  formatDurationForReportTable,
  formatAmountEarnedForReportTable,
  formatPayRateForReportTable
} from '../utilities';
import getStyle from './style';
import Times from '../../Times';
import TwoTzTimes from '../../TwoTzTimes';

function Row({
  hasTimes,
  primaryTimezone,
  secondaryTimezone,
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
        {(hasTimes && hasSecondaryTzTimes && (
          <TwoTzTimes
            {...{
              primaryTimezone,
              secondaryTimezone
            }}
            primaryTimezoneTimes={sessTzTimes}
            secondaryTimezoneTimes={jobTzTimes}
            {...commonTimesAttrs}
          />
        )) ||
        (hasTimes && (
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
    </tr>
  );
}

export default Row;
