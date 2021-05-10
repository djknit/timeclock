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

function getTimezoneAbbreviation(zoneName, date, isExtended) { // `isExtended` is only for zones whose abbrev is just the offset (eg. '-05')
  const tzAbbrev = moment.tz(date, zoneName).format('z');
  const isOffsetOnly = ['+', '-'].includes(tzAbbrev[0]);
  return (isExtended && isOffsetOnly) ? `GMT${tzAbbrev}` : tzAbbrev;
}

export {
  getValidTimezones,
  getTimezoneOptions,
  getTimezoneFullName,
  getTimezoneAbbreviation
};
