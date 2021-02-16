import processWeek from './processWeek';
import {
  getDurationInfo,
  getPaidAndUnpaidTotalTime
} from '../utilities';
import { getJobEarnings } from './earnings';
import { getInfoForCurrentTimePeriods } from './currentTimePeriods';

function processTimeData(rawWeeks, jobSettings, sessionTimezone, wasSessionTimezoneGuessed) {
  if (!rawWeeks || !jobSettings) return;
  const processedWeeks = rawWeeks.map(wk => processWeek(wk, sessionTimezone));
  const { totalTime, daysWorked } = getTotalTimeAndDaysWorked(processedWeeks);
  const {
    currentMonth, precedingMonth, currentWeek, precedingWeek
  } = getInfoForCurrentTimePeriods(processedWeeks, jobSettings);
  const earnings = getJobEarnings(processedWeeks);
  return {
    weeks: processedWeeks,
    totalTime,
    earnings,
    daysWorked,
    currentMonth,
    precedingMonth,
    currentWeek,
    precedingWeek,
    ...getPaidAndUnpaidTotalTime(earnings, totalTime),
    sessionTimezone,
    wasSessionTimezoneGuessed
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
