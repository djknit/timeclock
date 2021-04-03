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

  console.log('render Week\nweek\n', {
    isPartial,
    totals,
    weekNumber,
    dateRange,
    days,
    weekDocId
  })

  const style = getStyle();

  return (
    <section>
      <AreaHeader {...{ isPartial, weekNumber, dateRange }} />
      <main style={style.areaBody}>
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
      </main>
    </section>
  );
}

export default Week;
