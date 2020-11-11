import React from 'react';
import ContentArea from '../../../ContentArea';
import PeriodTotalsArea from './PeriodTotalsArea';

function Summary({
  style: styleProp,
  windowWidth,
  timeData
}) {

  const commonAttrs = { windowWidth };

  return (
    <ContentArea title="Summary" style={styleProp}>
      <PeriodTotalsArea
        label="Job Totals"
        {...commonAttrs}
        periodTotals={getJobTotals(timeData)}
        isExpandedInitially
      />
      <PeriodTotalsArea
        label="This Week"
        {...{ windowWidth }}
        periodTotals={timeData.currentWeek}
      />
      <PeriodTotalsArea
        label="Last Week"
        {...{ windowWidth }}
        periodTotals={timeData.precedingWeek}
      />
      <PeriodTotalsArea
        label="This Month"
        {...{ windowWidth }}
        periodTotals={timeData.currentMonth}
      />
      <PeriodTotalsArea
        label="Last Month"
        {...{ windowWidth }}
        periodTotals={timeData.precedingMonth}
      />
    </ContentArea>
  );
}

export default Summary;

function getJobTotals(timeData) {
  const { totalTime, earnings, daysWorked } = timeData;
  return { totalTime, earnings, daysWorked };
}