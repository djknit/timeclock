import React from 'react';
import getStyle from './style';
import { time as timeUtils, formatMyDate } from '../../utilities';
import Table from '../../Table';

function Day({
  day: {
    date,
    totals,
    segments,
    currency,
    officialTimezone,
    areTimezonesDifferent,
    reportTimezone,
    _id
  },
  reportHasMultipleTimezones,
  reportHasPaidTime
}) {

  const style = getStyle();
  
  return (
    <>
      <h2 style={style.heading}>
        {formatMyDate(date)}:
      </h2>
      <Table
        hasTimes
        hasSecondTzCol={reportHasMultipleTimezones}
        hasEarningCols={reportHasPaidTime}
        primaryTimezone={reportTimezone}
        secondaryTimezone={officialTimezone}
        {...{
          date
        }}
        rowGroups={[
          {
            rows: segments,
            hasTimes: true,
            isTotals: false
          },
          {
            rows: [{
              rowLabel: 'Day Total',
              ...totals
            }],
            hasTimes: false,
            isTotals: true
          }
        ]}
        style={style.table}
      />
    </>
  );
}

export default Day;
