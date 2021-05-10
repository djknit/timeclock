import React from 'react';
import getStyle, { getHeaderStyleVars } from './style';
import { getTotalsRowGroups } from '../utilities';
import TableAreaHeader from '../TableAreaHeader';
import Table from '../Table';

function Totals({
  totals,
  areaLabel = "Totals",
  reportHasPaidTime,
  reportHasMultipleTimezones,
  tableColWidths: colWidths,
  isReportTotals,
  tableWidthLevel,
  ...otherProps
}) {
  
  const style = getStyle(isReportTotals);
  const headerStyleVars = getHeaderStyleVars(isReportTotals);
  
  return (
    <Container {...{ isReportTotals }}>
      <TableAreaHeader
        label={areaLabel}
        style={style.areaHeader}
        {...{ isReportTotals }}
        isTotals
        styleVars={headerStyleVars}
      />
      <Table
        hasTimes={false}
        hasSecondTzCol={reportHasMultipleTimezones}
        hasSecondaryTzTimes={false}
        hasEarningCols={reportHasPaidTime}
        rowGroups={getTotalsRowGroups({ totals, reportHasPaidTime })}
        style={style.table}
        {...{ colWidths }}
        widthLevel={tableWidthLevel}
        {...otherProps}
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
    <>{props.children}</>
  );
}
