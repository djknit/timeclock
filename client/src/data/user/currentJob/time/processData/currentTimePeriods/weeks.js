import {
  getDurationInfo,
  jobData as jobDataUtils,
  dates as dateUtils,
  findWeekWithDate
} from '../utilities';

const { getDatesInWeekWithDate } = jobDataUtils;
const { getPrecedingDate } = dateUtils;

function getCurrentWeeksInfo(processedWeeks, todayDate, jobSettings) {
  const currentWeek = getInfoForWeekWithDate(todayDate, processedWeeks, jobSettings);
  const lastDateOfPrecedingWeek = getPrecedingDate(currentWeek.firstDate)
  return {
    currentWeek,
    precedingWeek: getInfoForWeekWithDate(lastDateOfPrecedingWeek, processedWeeks, jobSettings)
  };
}

export { getCurrentWeeksInfo };


function getInfoForWeekWithDate(date, processedWeeks, jobSettings) {
  const week = findWeekWithDate(date, processedWeeks);
  if (!week) {
    const weekDates = getDatesInWeekWithDate(date, jobSettings.weekBegins);
    return {
      firstDate: weekDates[0],
      lastDate: weekDates[weekDates.length - 1],
      totalTime: getDurationInfo(0),
      daysWorked: 0,
      earnings: null
    };
  }
  const { firstDate, lastDate, totalTime, daysWorked, earnings } = week;
  return { firstDate, lastDate, totalTime, daysWorked, earnings };
}
