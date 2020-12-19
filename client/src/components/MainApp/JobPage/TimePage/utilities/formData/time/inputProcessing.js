import moment from 'moment-timezone';
import { convertAmPmTimeTo24hr } from '../../../../utilities';

function getTimestampFromDateAndTime(date, time, timezone) {
  const _time = time.is24hr ? time : convertAmPmTimeTo24hr(time);
  let dateTimeInfo = {
    ...date,
    hour: _time.hour,
    minute: _time.minute
  };
  return moment.tz(dateTimeInfo, timezone).valueOf();
}

export { getTimestampFromDateAndTime };
