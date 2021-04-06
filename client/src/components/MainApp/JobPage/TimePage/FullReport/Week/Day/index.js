import React from 'react';
import getStyle from './style';
import { formatMyDate } from '../../utilities';
import TableAreaHeader from '../../TableAreaHeader';
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
      <TableAreaHeader label={formatMyDate(date)} />
      <Table
        hasTimes={segments.length > 0}
        hasSecondTzCol={reportHasMultipleTimezones}
        hasSecondaryTzTimes={areTimezonesDifferent}
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
            // isTotals: false
          },
          {
            rows: [{
              rowLabel: 'Day Total',
              ...totals
            }],
            hasTimes: false,
          }
        ]}
        style={style.table}
      />
    </>
  );
}

export default Day;
