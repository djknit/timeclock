import React from 'react';
import getStyle from './style';
import AreaHeader from './AreaHeader';
import Day from './Day';

function Week({
  week: {
    isPartial,
    totals,
    weekNumber,
    dateRange,
    days,
    weekDocId
  }
}) {

  const style = getStyle();

  return (
    <>
      <AreaHeader {...{ isPartial, weekNumber, dateRange }} />
      {days.map(day => (
        <Day key={day._id} {...{ day }} />
      ))}
    </>
  );
}

export default Week;
