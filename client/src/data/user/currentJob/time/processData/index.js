import processWeek from './processWeek';
import { getDurationInfo } from '../utilities';
import { getJobEarnings } from './earnings';

function processTimeData(rawWeeks) {
  if (!rawWeeks) return;
  const processedWeeks = rawWeeks.map(processWeek);

  const { totalTime, daysWorked } = getTotalTimeAndDaysWorked(processedWeeks);

  return {
    weeks: processedWeeks,
    totalTime,
    earnings: getJobEarnings(processedWeeks),
    daysWorked
  };
}

export default processTimeData;


function getTotalTimeAndDaysWorked(weeks) {
  let totalTimeInMsec = 0;
  let totalDaysWorked = 0;
  weeks.forEach(({ totalTime, daysWorked }) => {
    totalTimeInMsec += totalTime.durationInMsec;
    totalDaysWorked += daysWorked;
  });
  return {
    totalTime: getDurationInfo(totalTimeInMsec),
    daysWorked: totalDaysWorked
  };
}
