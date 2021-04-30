import React from 'react';
import getStyle, { getHeaderStyleVars } from './style';
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
  tableWidthLevel,
  tableColWidths,
  ...otherProps
}) { 

  const style = getStyle();
  const headerStyleVars = getHeaderStyleVars();
  
  return (
    <>
      <TableAreaHeader
        label={formatMyDate(date)}
        style={style.header}
        styleVars={headerStyleVars}
      />
      <Table
        hasTimes={segments.length > 0}
        hasSecondTzCol={reportHasMultipleTimezones}
        hasSecondaryTzTimes={areTimezonesDifferent}
        hasEarningCols={reportHasPaidTime}
        primaryTimezone={reportTimezone}
        secondaryTimezone={officialTimezone}
        {...{ date }}
        {...otherProps}
        rowGroups={[
          {
            rows: segments,
            hasTimes: true,
          },
          {
            rows: [{ rowLabel: 'Day Total', ...totals }],
            hasTimes: false,
          }
        ]}
        style={style.table}
        widthLevel={tableWidthLevel}
        colWidths={tableColWidths}
      />
    </>
  );
}

export default Day;
