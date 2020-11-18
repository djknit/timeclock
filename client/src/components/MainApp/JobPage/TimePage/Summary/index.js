import React from 'react';
import ContentArea from '../../../ContentArea';
import PeriodTotalsArea, { PeriodTotalsAreaBeginExpanded } from './PeriodTotalsArea';

function Summary({
  style: styleProp,
  windowWidth,
  timeData
}) {

  const commonAttrs = { windowWidth };

  return (
    <ContentArea title="Summary" style={styleProp}>
      <PeriodTotalsAreaBeginExpanded
        label="Job Totals"
        {...commonAttrs}
        periodTotals={getJobTotals(timeData)}
      />
      <PeriodTotalsArea
        label="This Week"
        {...commonAttrs}
        periodTotals={timeData.currentWeek}
      />
      <PeriodTotalsArea
        label="Last Week"
        {...commonAttrs}
        periodTotals={timeData.precedingWeek}
      />
      <PeriodTotalsArea
        label="This Month"
        {...commonAttrs}
        periodTotals={timeData.currentMonth}
      />
      <PeriodTotalsArea
        label="Last Month"
        {...commonAttrs}
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
