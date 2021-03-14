import { currentJobSessionTzStore } from '../../../../../../data';
import {
  getTimeInfoFromUtcTime,
  dates as dateUtils,
  formatMyDate
} from '../../utilities';

const { areDatesEquivalent, getPrecedingDate } = dateUtils;

function getDateAddedOnText(date, isCapitalized) {
  const timezone = currentJobSessionTzStore.sessionTimezone;
  const today = getTimeInfoFromUtcTime(Date.now(), timezone).date;
  if (areDatesEquivalent(date, today)) {
    return 'today';
  }
  if (areDatesEquivalent(date, getPrecedingDate(today))) {
    return 'yesterday';
  }
  let formatString = 'dddd, MMM. D';
  if (date.year !== today.year) {
    formatString += ', YYYY'
  }
  return formatMyDate(date, formatString, true);
}

export {
  getDateAddedOnText
};
