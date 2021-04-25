import React, { Component } from 'react';
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
  registerColWidthsGetter,
  unregisterColWidthsGetter,
  tableColWidths
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
        style={style.areaHeader}
      />
      <main style={style.areaBody}>
        {days.map(day => (
          <Day
            key={day._id}
            {...{
              day,
              reportHasPaidTime,
              reportHasMultipleTimezones,
              registerColWidthsGetter,
              unregisterColWidthsGetter,
              tableColWidths
            }}
          />
        ))}
        <Totals
          {...{
            totals,
            reportHasPaidTime,
            reportHasMultipleTimezones,
            registerColWidthsGetter,
            tableColWidths
          }}
          areaLabel={`Week ${weekNumber} Totals`}
        />
      </main>
    </section>
  );
};

export default Week;
