import moment from 'moment';
import { dates as dateUtils } from '../../../../utilities';
import getDateRangeInfo from '../../getDateRangeInfo';

const { convertMomentToMyDate } = dateUtils;

export { getCurrentMonthsInfo };


function getCurrentMonthsInfo(processedWeeks, todayDate) {
  const { month, year } = todayDate;
  const currentMonthDateRange = getDateRangeOfMonth(month, year);
  const previousMonth = (month - 1 + 12) % 12;
  const previousMonthYear = month > 0 ? year : year - 1;
  const previousMonthDateRange = getDateRangeOfMonth(previousMonth, previousMonthYear);
  return {
    currentMonth: getDateRangeInfo(currentMonthDateRange, processedWeeks),
    precedingMonth: getDateRangeInfo(previousMonthDateRange, processedWeeks)
  };
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
