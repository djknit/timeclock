import moment from 'moment-timezone';

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

export { getValidTimezones, getTimezoneAbbreviation, guessUserTimezone, getTimezoneOptions };