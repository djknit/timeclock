import {
  getDurationInfo,
  jobData as jobDataUtils,
  dates as dateUtils,
  findWeekWithDate
} from '../utilities';

const { getFirstDayOfWeekForDate } = jobDataUtils;
const {
  getPrecedingDate,
  getNextDate,
  areDatesEquivalent
} = dateUtils;

export { getCurrentWeeksInfo };


function getCurrentWeeksInfo(processedWeeks, todayDate, jobSettings) {
  const currentWeek = getInfoForWeekWithDate(todayDate, processedWeeks, jobSettings);
  const lastDateOfPrecedingWeek = getPrecedingDate(currentWeek.firstDate)
  return {
    currentWeek,
    precedingWeek: getInfoForWeekWithDate(lastDateOfPrecedingWeek, processedWeeks, jobSettings)
  };
}

function getInfoForWeekWithDate(date, processedWeeks, jobSettings) {
  const week = findWeekWithDate(date, processedWeeks);
  if (!week) {
    const { firstDate, lastDate } = getDateRangeOfWeekWithDate(date, jobSettings.weekBegins);
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

function getDateRangeOfWeekWithDate(date, weekBeginsValueSchedule) { // only needed when data doesn't exist yet for week
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
