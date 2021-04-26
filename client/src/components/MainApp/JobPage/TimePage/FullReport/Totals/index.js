import React from 'react';
import getStyle from './style';
import { getTotalsRowGroups } from '../utilities';
import TableAreaHeader from '../TableAreaHeader';
import Table from '../Table';

function Totals({
  totals,
  areaLabel = "Totals",
  reportHasPaidTime,
  reportHasMultipleTimezones,
  registerWidthsGetter,
  unregisterWidthsGetter,
  tableColWidths: colWidths,
  isReportTotals
}) {

  const style = getStyle(isReportTotals);
  
  return (
    <Container {...{ isReportTotals }}>
      <TableAreaHeader
        label={areaLabel}
        style={style.areaHeader}
        {...{ isReportTotals }}
        isTotals
      />
      <Table
        hasTimes={false}
        hasSecondTzCol={reportHasMultipleTimezones}
        hasSecondaryTzTimes={false}
        hasEarningCols={reportHasPaidTime}
        rowGroups={getTotalsRowGroups({ totals, reportHasPaidTime })}
        style={style.table}
        {...{
          colWidths,
          registerWidthsGetter,
          unregisterWidthsGetter
        }}
      />
    </Container>
  ); 
}

export default Totals;


function Container({
  isReportTotals,
  ...props
}) {
  return isReportTotals ? (
    <section {...props} />
  ) : (
    props.children
  );
}
