import moment from 'moment-timezone';
import api from './api';
export * from './jobData';
export * from './dates';
export * from './data';
export * from './currency';
export * from './constants';
export { time } from './shared';
export * from './time';

function capitalizeFirstLetter(string) {
  // source: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  return string && (string.charAt(0).toUpperCase() + string.slice(1));
}

function isWindowWide(windowWidth) {
  return windowWidth >= 769;
}

function roundNumToNDecimalDigits(numToRound, numDecDigs /* (n) */) {
  // source: https://www.jacklmoore.com/notes/rounding-in-javascript/
  const roundedScaledNum = Math.round(`${numToRound}e${numDecDigs}`);
  const negNumDecDigs = ( // add or remove "-" to get string representation of additive inverse
    numDecDigs > 0 ? `-${numDecDigs}` : numDecDigs.toString().slice(1)
  );
  return Number(`${roundedScaledNum}e${negNumDecDigs}`);
}

function guessUserTimezone() {
  return moment.tz.guess();
}

function findItemInArray(array, checkIsItem, removeItemFromArray) {
  for (const i in array) {
    const el = array[i];
    if (checkIsItem(el)) {
      return removeItemFromArray ? array.splice(i, 1)[0] : el;
    }
  }
}

export {
  api,
  capitalizeFirstLetter,
  isWindowWide,
  roundNumToNDecimalDigits,
  guessUserTimezone,
  findItemInArray
};
