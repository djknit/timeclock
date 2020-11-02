import sharedResources from '../shared';

let dateUtils = sharedResources.utilities.dates;

const { getMoment, convertMomentToMyDate, getUtcDateTime } = dateUtils;

function getNextDate(myDate) {
  return convertMomentToMyDate(getMoment(myDate).add(1, 'days'));
}

function isDateInRange(dateRange, date) {
  const { firstDate, lastDate } = dateRange;
  const firstDateUtcTime = getUtcDateTime(firstDate);
  const lastDateUtcTime = getUtcDateTime(lastDate);
  const dateUtcTime = getUtcDateTime(date);
  return firstDateUtcTime <= dateUtcTime && dateUtcTime <= lastDateUtcTime;
}

export const dates = { 
  ...dateUtils,
  getNextDate,
  isDateInRange
};