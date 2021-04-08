import React from 'react';
import getStyle from './style';
import { getTotalsRowGroups } from '../utilities';
import TableAreaHeader from '../TableAreaHeader';
import Table from '../Table';

function Totals({
  totals,
  areaLabel = "Totals",
  reportHasPaidTime,
  reportHasMultipleTimezones
}) {

  const style = getStyle();
  
  return (
    <>
      <TableAreaHeader label={areaLabel} />
      <Table
        hasTimes={false}
        hasSecondTzCol={reportHasMultipleTimezones}
        hasSecondaryTzTimes={false}
        hasEarningCols={reportHasPaidTime}
        rowGroups={getTotalsRowGroups({ totals, reportHasPaidTime })}
        style={style.table}
      />
    </>
  ); 
}

export default Totals;
