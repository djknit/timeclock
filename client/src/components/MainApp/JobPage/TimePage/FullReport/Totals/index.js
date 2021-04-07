import React from 'react';
import getStyle from './style';
import TableAreaHeader from '../TableAreaHeader';
import Table from '../Table';

function Totals({
  totals: {
    paid,
    unpaid,
    byCurrency
  },
  areaLabel = "Totals",
  reportHasPaidTime,
  reportHasMultipleTimezones
}) {

  const style = getStyle();
  
  return (
    <>
      <TableAreaHeader label={areaLabel} />
      {/* <Table
        hasTimes={false}
        hasSecondTzCol={reportHasMultipleTimezones}
        hasSecondaryTzTimes={false}
        hasEarningCols={reportHasPaidTime}
        rowGroups={[
          {
            rows: segments,
            hasTimes: false,
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
      /> */}
    </>
  ); 
}

export default Totals;
