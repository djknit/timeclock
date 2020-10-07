import {
  cloneMyDate,
  convertDayCutoffToMinutes,
  getDayCutoffTime,
  dates as dateUtils
} from '../utilities';

const { getMoment, convertMomentToMyDate } = dateUtils;

export default function processDay(day) {

  const { date, startCutoff, endCutoff, startTimeZone, timezone, wage, _id } = day;



  return {
    date: cloneMyDate(date)
  };
};

function getDayStartTime(date, startCutoff, timezone) {
  // need moment with date (midnight) and timezone
    // add cutoff
    // get date and time from moment
  
    // OR:
  const startTimeTime = getDayCutoffTime(startCutoff);
  const startTimeDate = startCutoff >= 0 ? (
    date
  ) : (convertMomentToMyDate(getMoment(date).subtract(1, 'days')));
  return {
    time: startTimeTime,
    date: startTimeDate
  }
} 

function getDayEndTime() {

}