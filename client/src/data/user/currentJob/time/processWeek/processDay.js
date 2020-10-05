import { cloneMyDate } from '../utilities';

export default function processDay(day) {

  const { date, startCutoff, endCutoff, startTimeZone, timezone, wage, _id } = day;



  return {
    date: cloneMyDate(date)
  };
};

function getDayStartTime(date, startCutoff, timezone) {

}

function getDayEndTime() {

}