import { currentJobTimeService } from '../../../../../../data';

function processTimeForReport(timeData, reportOptions = {}) {
  const {
    dateRange: { firstDate, lastDate} = {}
  } = reportOptions;
  // map weeks to only needed data formatted and outside-of-range days removed
  // format only needed data from totals 
      // taken from timeData if no range
      // if range, use utility method
}
