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
  reportHasPaidTime,
  reportHasMultipleTimezones,
  registerWidthsGetter,
  unregisterWidthsGetter,
  tableColWidths
}) {

  const commonTableAttrs = {
    reportHasPaidTime,
    reportHasMultipleTimezones,
    registerWidthsGetter,
    unregisterWidthsGetter,
    tableColWidths
  };

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
            {...commonTableAttrs}
            {...{ day }}
          />
        ))}
        <Totals
          {...commonTableAttrs}
          {...{ totals }}
          areaLabel={`Week ${weekNumber} Totals`}
        />
      </main>
    </section>
  );
};

export default Week;
