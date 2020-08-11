import moment from 'moment-timezone';
import * as utilities from '../../utilities';

export * from '../../utilities';
export * from './formRefs';

function formatMyDate(myDate) {
  return utilities.dates.getMoment(myDate).format('MMM D, YYYY');
}

function getValidTimezones() {
  return moment.tz.names();
}

function getTimezoneOptions() {
  return getValidTimezones().map(
    tzName => {
      const abbreviation = getTimezoneAbbreviation(tzName);
      return {
        name: `${tzName} (${abbreviation})`,
        value: tzName
      };
    }
  );
}

function getTimezoneAbbreviation(zoneName) {
  return moment.tz(zoneName).format('z');
}

function guessUserTimezone() {
  return moment.tz.guess();
}

export { formatMyDate, getValidTimezones, getTimezoneAbbreviation, guessUserTimezone, getTimezoneOptions };