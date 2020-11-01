import moment from 'moment';
import { dates as dateUtils } from '../utilities';
import getDateRangeInfo from '../../getDateRangeInfo';

const { convertMomentToMyDate } = dateUtils;

export { getCurrentMonthsInfo };


function getCurrentMonthsInfo(processedWeeks, todayDate) {
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

function getDateRangeOfMonth(month, year) {
  const firstDate = {
    day: 1,
    month,
    year
  };
  const lastDate = convertMomentToMyDate(moment(firstDate).endOf('month'));
  return { firstDate, lastDate };
}