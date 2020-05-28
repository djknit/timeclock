import moment from 'moment-timezone';
import * as utilities from '../../utilities';

export * from './formData';
export * from '../../utilities';

function formatMyDate(myDate) {
  return utilities.dates.getMoment(myDate).format('MMM D, YYYY');
}

function getValidTimezones() {
  return moment.tz.names();
}

function getTimezoneAbbreviation(zoneName) {
  return moment.tz(zoneName).format('z');
}

function guessUserTimezone() {
  return moment.tz.guess();
}

export { formatMyDate, getValidTimezones, getTimezoneAbbreviation, guessUserTimezone };