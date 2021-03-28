import moment from 'moment-timezone';

function getValidTimezones() {
  return moment.tz.names();
}

function getTimezoneOptions() {
  return getValidTimezones().map(
    tzName => {
      return {
        name: getTimezoneFullName(tzName),
        value: tzName
      };
    }
  );
}

function getTimezoneFullName(tzName) {
  const abbreviation = getTimezoneAbbreviation(tzName);
  return `${tzName} (${abbreviation})`;
}

function getTimezoneAbbreviation(zoneName, date) {
  return moment.tz(date, zoneName).format('z');
}

export {
  getValidTimezones,
  getTimezoneOptions,
  getTimezoneFullName,
  getTimezoneAbbreviation
};
