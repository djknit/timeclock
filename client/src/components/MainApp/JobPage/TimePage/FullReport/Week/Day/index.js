import React from 'react';
import getStyle, { headingStyleVars } from './style';
import { formatMyDate } from '../../utilities';
import Table from '../../Table';
import InnerAreaHeader from '../../../InnerAreaHeader';

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
      <InnerAreaHeader
        label={formatMyDate(date)}
        style={style.heading}
        ranking={3}
        styleVariables={headingStyleVars}
      />
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
