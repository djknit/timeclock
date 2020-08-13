import moment from 'moment-timezone';
import * as utilities from '../../utilities';

export * from '../../utilities';
export * from './formRefs';
export * from './elemental';
export * from './formData';
export * from './displayData';

function formatMyDate(myDate, formatString) {
  return utilities.dates.getMoment(myDate).format(formatString || 'MMM D, YYYY');
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