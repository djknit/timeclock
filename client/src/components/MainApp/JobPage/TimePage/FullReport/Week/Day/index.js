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

  const segsRowGroups = (
    (segments && segments.length > 0) ? [{ hasTimes: true, rows: segments }] : []
  );
  const totalsRowGroup = { hasTimes: false, rows: [{ rowLabel: 'Day Total', ...totals }] };

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
        rowGroups={[ ...segsRowGroups, totalsRowGroup ]}
        style={style.table}
        widthLevel={tableWidthLevel}
        colWidths={tableColWidths}
      />
    </>
  );
}

export default Day;
