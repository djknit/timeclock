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
    // weekDocId
  },
  ...otherProps
}) {

  const style = getStyle();

  return (
    <section>
      <AreaHeader
        {...{
          isPartial,
          weekNumber,
          dateRange
        }}
      />
      <main style={style.areaBody}>
        {days.map(day => (
          <Day
            key={day._id}
            {...otherProps}
            {...{ day }}
          />
        ))}
        <Totals
          {...otherProps}
          {...{ totals }}
          areaLabel={`Week ${weekNumber} Totals`}
        />
      </main>
    </section>
  );
};

export default Week;
