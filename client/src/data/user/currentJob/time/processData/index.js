import processWeek from './processWeek';
import {
  getDurationInfo
} from '../utilities';
import { getJobEarnings } from './earnings';
import { getInfoForCurrentTimePeriods } from './currentTimePeriods';

function processTimeData(rawWeeks, jobSettings) {
  if (!rawWeeks || !jobSettings) return;

  const processedWeeks = rawWeeks.map(processWeek);

  const { totalTime, daysWorked } = getTotalTimeAndDaysWorked(processedWeeks);
  const {
    currentMonth, precedingMonth, currentWeek, precedingWeek
  } = getInfoForCurrentTimePeriods(processedWeeks, jobSettings);

  return {
    weeks: processedWeeks,
    totalTime,
    earnings: getJobEarnings(processedWeeks),
    daysWorked,
    currentMonth,
    precedingMonth,
    currentWeek,
    precedingWeek
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
