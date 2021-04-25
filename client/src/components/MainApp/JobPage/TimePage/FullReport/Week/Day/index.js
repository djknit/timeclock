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
    officialTimezone,
    areTimezonesDifferent,
    reportTimezone,
    // _id
  },
  reportHasMultipleTimezones,
  reportHasPaidTime,
  registerColWidthsGetter,
  unregisterColWidthsGetter,
  tableColWidths: colWidths
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
          date,
          registerColWidthsGetter,
          unregisterColWidthsGetter,
          colWidths
        }}
        rowGroups={[
          {
            rows: segments,
            hasTimes: true,
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
