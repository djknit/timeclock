import sharedResources from '../shared';

let dateUtils = sharedResources.utilities.dates;

const { getUtcDateTime } = dateUtils;

function isDateInRange(dateRange, date) {
  const { firstDate, lastDate } = dateRange;
  const firstDateUtcTime = getUtcDateTime(firstDate);
  const lastDateUtcTime = getUtcDateTime(lastDate);
  const dateUtcTime = getUtcDateTime(date);
  return firstDateUtcTime <= dateUtcTime && dateUtcTime <= lastDateUtcTime;
}

export const dates = { 
  ...dateUtils,
  isDateInRange
};
