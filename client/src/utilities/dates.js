import { dates as dateUtils } from './shared';

const { getUtcDateTime } = dateUtils;

function isDateInRange({ firstDate, lastDate } = {}, date) {
  const firstDateUtcTime = getUtcDateTime(firstDate);
  const lastDateUtcTime = getUtcDateTime(lastDate);
  const dateUtcTime = getUtcDateTime(date);
  return (
    (!firstDate || firstDateUtcTime <= dateUtcTime) &&
    (!lastDate || dateUtcTime <= lastDateUtcTime)
  );
}

export const dates = {
  ...dateUtils,
  isDateInRange
};
