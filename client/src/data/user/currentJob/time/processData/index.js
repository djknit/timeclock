import processWeek from './processWeek';
import {
  getDurationInfo,
  jobData as jobDataUtils,
  dates as dateUtils
} from '../utilities';
import { getJobEarnings } from './earnings';
import getDateRangeInfo from '../getDateRangeInfo';

const { getDateForTime } = jobDataUtils;
const { getMoment, convertMomentToMyDate } = dateUtils;

function processTimeData(rawWeeks, jobSettings) {
  if (!rawWeeks) return;

  const processedWeeks = rawWeeks.map(processWeek);

  const { totalTime, daysWorked } = getTotalTimeAndDaysWorked(processedWeeks);
  const { currentMonth, previousMonth } = getStatsForMonths(processedWeeks, jobSettings);

  return {
    weeks: processedWeeks,
    totalTime,
    earnings: getJobEarnings(processedWeeks),
    daysWorked,
    currentMonth,
    previousMonth
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

function getStatsForMonths(processedWeeks, jobSettings) {
  const { month, year } = getDateForTime(Date.now(), jobSettings, true);
  const currentMonthDateRange = getDateRangeOfMonth(month, year);
  const previousMonth = (month || 12) - 1;
  const previousMonthYear = month ? year : year - 1;
  const previousMonthDateRange = getDateRangeOfMonth(previousMonth, previousMonthYear);
  return {
    currentMonth: _getInfo(currentMonthDateRange),
    previousMonth: _getInfo(previousMonthDateRange)
  };
  function _getInfo({ firstDate, lastDate }) {
    return getDateRangeInfo(firstDate, lastDate, processedWeeks);
  }
}

function getDateRangeOfMonth(monthIndex, year) {
  const firstDate = {
    day: 1,
    month: monthIndex,
    year
  };
  const firstDateOfNextMonth = {
    day: 1,
    month: (monthIndex + 1) % 12,
    year: monthIndex !== 11 ? year : year + 1
  };
  const lastDateMoment = getMoment(firstDateOfNextMonth).subtract(1, 'days');
  const lastDate = convertMomentToMyDate(lastDateMoment);
  return { firstDate, lastDate };
}