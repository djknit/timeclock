import {
  convertDayCutoffToMinutes,
  getDayCutoffTime,
  dates as dateUtils,
  getDurationInfo,
  processWage,
  getTimestampFromDateAndTime,
  getTimeInfoFromUtcTime
} from '../../../../../utilities';
import { cloneMyDate } from '../../../elemental';
import processSegments from './processSegments';

const { getPrecedingDate, getNextDate } = dateUtils;

export default function processDay(
  { date, startCutoff, endCutoff, startTimezone, timezone, wage, _id, segments },
  sessionTimezone
) {

  return {
    _id: _id.toString(),
    date: cloneMyDate(date),
    startTime: getDayBoundary(
      date, startCutoff, startTimezone, getOutputTzs(sessionTimezone, timezone, startTimezone)
    ),
    endTime: getDayBoundary(
      getNextDate(date), endCutoff, timezone, getOutputTzs(sessionTimezone, timezone)
    ),
    settings: {
      dayCutoff: convertDayCutoffToMinutes(endCutoff),
      timezone,
      wage: processWage(wage)
    },
    segments: processSegments(segments, getOutputTzs(sessionTimezone, timezone)),
    totalTime: getTotalSegmentsDurationInfo(segments)
  };
};

function getOutputTzs(sessionTimezone, jobScheduledTimezone, otherJobSchedTimezone) {
  let primary, alt = {};
  if (sessionTimezone) {
    primary = sessionTimezone;
    alt.job = jobScheduledTimezone;
  }
  else {
    primary = jobScheduledTimezone;
  }
  if (otherJobSchedTimezone) {
    alt.governing = otherJobSchedTimezone;
  }
  return { primary, alt };
}

function getDayBoundary(date, rawCutoffValue, timezone, outputTimezones) {
  const cutoff = convertDayCutoffToMinutes(rawCutoffValue);
  const dayBoundaryTime = getDayCutoffTime(cutoff);
  const dayBoundaryDate = (cutoff >= 0) ? date : getPrecedingDate(date);
  const boundaryUtcTime = getTimestampFromDateAndTime(dayBoundaryDate, dayBoundaryTime, timezone);
  return getTimeInfoFromUtcTime(boundaryUtcTime, outputTimezones.primary, outputTimezones.alt);
}

function getTotalSegmentsDurationInfo(segments) {
  let totalTimeInMsec = 0;
  segments.forEach(({ startTime, endTime }) => {
    const segmentDuration = endTime - startTime;
    totalTimeInMsec += segmentDuration;
  });
  return getDurationInfo(totalTimeInMsec);
}
