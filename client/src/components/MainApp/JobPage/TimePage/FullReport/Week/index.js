import React from 'react';
import getStyle from './style';
import AreaHeader from './AreaHeader';
import Day from './Day';
import Totals from '../Totals';

function Week({
  week: {
    isPartial,
    totals,
    weekNumber,
    dateRange,
    days,
    weekDocId
  },
  reportHasPaidTime,
  reportHasMultipleTimezones
}) {

  const style = getStyle();

  return (
    <>
      <AreaHeader {...{ isPartial, weekNumber, dateRange }} />
      <div style={style.areaBody}>
        {days.map(day => (
          <Day
            key={day._id}
            {...{
              day,
              reportHasPaidTime,
              reportHasMultipleTimezones
            }}
          />
        ))}
        <Totals {...{ totals }} />
      </div>
    </>
  );
}

export default Week;
