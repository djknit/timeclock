const moment = require('moment-timezone');

const { areDatesEquivalent, getUtcMoment } = require('../../utilities');

const {
  getMostRecentScheduleValueForDate,
  convertMomentToMyDate,
  getMoment,
} = require('../../utilities');

module.exports = {
  createDaysForDates,
  findDayForDate,
  findDayWithId,
  getIdsOfDaysInRange,
  isSegmentInDay,
  getDayStartTime,
  getDayEndTime
};

function createDaysForDates(dates, job) {
  return dates.map(date => {
    const precedingDate = convertMomentToMyDate(getMoment(date).subtract(1, 'days'));
    return {
      date,
      startCutoff: getMostRecentScheduleValueForDate(precedingDate, job.dayCutoff),
      endCutoff: getMostRecentScheduleValueForDate(date, job.dayCutoff),
      startTimezone: getMostRecentScheduleValueForDate(precedingDate, job.timezone),
      timezone: getMostRecentScheduleValueForDate(date, job.timezone),
      wage: getMostRecentScheduleValueForDate(date, job.wage),
      job: job._id
    };
  });
}

function findDayForDate(date, days) {
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    if (areDatesEquivalent(date, day.date)) {
      return day;
    }
  }
  return null;
}

function findDayWithId(dayId, days) {
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    if (day._id.toString() === dayId.toString()) {
      // console.log('HIT HIT HIT  eowpf afp')
      return day;
    }
  }
  return null;
}

function getIdsOfDaysInRange(firstDateUtcTime, lastDateUtcTime, days) {
  return days
  .filter(day => {
    const dayUtcDateTime = getUtcMoment(day.date).valueOf();
    console.log(dayUtcDateTime)
    console.log(firstDateUtcTime <= dayUtcDateTime && dayUtcDateTime <= lastDateUtcTime)
    return firstDateUtcTime <= dayUtcDateTime && dayUtcDateTime <= lastDateUtcTime;
  })
  .map(day => day._id);
}

function isSegmentInDay(day, segment) {
  const dayStartTime = getDayStartTime(day);
  const dayEndTime = getDayEndTime(day);
  const { startTime, endTime } = segment;
  const isStartTimeInDay = dayStartTime <= startTime && startTime <= dayEndTime;
  const isEndTimeInDay = dayStartTime <= endTime && endTime <= dayEndTime;
  return (
    isStartTimeInDay && isEndTimeInDay ?
    {
      startTime: isStartTimeInDay,
      endTime: isEndTimeInDay
    } :
    false
  );
}

function getDayStartTime(day) {
  const { date, startTimezone, startCutoff } = day;
  return getMoment(date, startTimezone).valueOf() + startCutoff;
}

function getDayEndTime(day) {
  const { date, timezone, endCutoff } = day;
  return getMoment(date, timezone).add(1, 'days').valueOf() + endCutoff;
}