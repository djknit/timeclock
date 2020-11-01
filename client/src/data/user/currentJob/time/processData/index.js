import moment from 'moment';
import processWeek from './processWeek';
import {
  getDurationInfo,
  jobData as jobDataUtils,
  dates as dateUtils,
  findWeekWithDate
} from '../utilities';
import getDateRangeInfo from '../getDateRangeInfo';
import { getJobEarnings } from './earnings';
import { getInfoForCurrentTimePeriods } from './currentTimePeriods';

const { getDateForTime, getFirstDayOfWeekForDate } = jobDataUtils;
const {
  getPrecedingDate,
  convertMomentToMyDate,
  getNextDate,
  areDatesEquivalent
} = dateUtils;

function processTimeData(rawWeeks, jobSettings) {
  if (!rawWeeks) return;

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
