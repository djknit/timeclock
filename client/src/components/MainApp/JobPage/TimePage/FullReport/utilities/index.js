import React from 'react';
import { formatMyDate } from '../../utilities';
export * from '../../utilities';
export * from './totalsTableData';

export { getWeekDateRangeText };


function getWeekDateRangeText({ dateRange } = {}, isString) {
  if (!dateRange) return;
  const { firstDate, lastDate } = dateRange;
  const shortFormatString = 'MMM. D';
  const longFormatString = `${shortFormatString}, YYYY`;
  const firstDateFormatStr = firstDate.year === lastDate.year ? shortFormatString : longFormatString;
  const firstDateText = formatMyDate(firstDate, firstDateFormatStr, isString);
  const lastDateText = formatMyDate(lastDate, longFormatString, isString);
  return isString ? (
    `${firstDateText} – ${lastDateText}`
  ) : (
    <>{firstDateText}&nbsp;&ndash;&nbsp;{lastDateText}</>
  );
}
