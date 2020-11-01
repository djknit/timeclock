import moment from 'moment';
import processWeek from './processWeek';
import {
  getDurationInfo,
  jobData as jobDataUtils,
  dates as dateUtils,
  findWeekWithDate
} from '../utilities';
import { getJobEarnings } from './earnings';
import getDateRangeInfo from '../getDateRangeInfo';

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
  } = getStatsForCurrentTimePeriods(processedWeeks, jobSettings);

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

function getStatsForCurrentTimePeriods(processedWeeks, jobSettings) {
  const today = getDateForTime(Date.now(), jobSettings, true);
  return {
    ...getStatsForMonths(processedWeeks, today),
    ...getStatsForCurrentWeeks(processedWeeks, today, jobSettings)
  };
}

function getStatsForMonths(processedWeeks, todayDate) {
  const { month, year } = todayDate;
  const currentMonthDateRange = getDateRangeOfMonth(month, year);
  const previousMonth = (month || 12) - 1;
  const previousMonthYear = month ? year : year - 1;
  const previousMonthDateRange = getDateRangeOfMonth(previousMonth, previousMonthYear);
  return {
    currentMonth: _getInfo(currentMonthDateRange),
    precedingMonth: _getInfo(previousMonthDateRange)
  };
  function _getInfo({ firstDate, lastDate }) {
    return getDateRangeInfo(firstDate, lastDate, processedWeeks);
  }
}

function getStatsForCurrentWeeks(processedWeeks, todayDate, jobSettings) {
  const currentWeek = getStatsForWeekWithDate(todayDate, processedWeeks, jobSettings);
  const lastDateOfPrecedingWeek = getPrecedingDate(currentWeek.firstDate)
  return {
    currentWeek,
    precedingWeek: getStatsForWeekWithDate(lastDateOfPrecedingWeek, processedWeeks, jobSettings)
  };
}

function getStatsForWeekWithDate(date, processedWeeks, jobSettings) {
  const week = findWeekWithDate(date, processedWeeks);
  if (!week) {
    const { firstDate, lastDate } = getFirstAndLastDaysOfWeekWithDate(date, jobSettings.weekBegins);
    return {
      firstDate,
      lastDate,
      totalTime: getDurationInfo(0),
      daysWorked: 0,
      earnings: null
    };
  }
  const { firstDate, lastDate, totalTime, daysWorked, earnings } = week;
  return { firstDate, lastDate, totalTime, daysWorked, earnings };
}

function getFirstAndLastDaysOfWeekWithDate(date, weekBeginsValueSchedule) {
  const firstDate = getFirstDayOfWeekForDate(date, weekBeginsValueSchedule);
  let lastDate = firstDate;
  for (let i = 0; i < 7; i++) {
    const nextDate = getNextDate(lastDate);
    const firstDateOfWeekWithNextDate = getFirstDayOfWeekForDate(nextDate, weekBeginsValueSchedule);
    if (!areDatesEquivalent(firstDateOfWeekWithNextDate, firstDate)) {
      return { firstDate, lastDate };
    }
    lastDate = nextDate;
  }
}

function getDateRangeOfMonth(month, year) {
  const firstDate = {
    day: 1,
    month,
    year
  };
  const lastDate = convertMomentToMyDate(moment(firstDate).endOf('month'));
  return { firstDate, lastDate };
}