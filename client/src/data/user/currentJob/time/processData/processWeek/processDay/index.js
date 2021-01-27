import {
  cloneMyDate,
  convertDayCutoffToMinutes,
  getDayCutoffTime,
  dates as dateUtils,
  getDurationInfo,
  processWage,
  getTimestampFromDateAndTime,
  getTimeInfoFromUtcTime
} from '../../../utilities';
import processSegments from './processSegments';

const { getPrecedingDate, getNextDate } = dateUtils;

export default function processDay(
  { date, startCutoff, endCutoff, startTimezone, timezone, wage, _id, segments },
  sessionTimezone
) {
  // const startTime = getDayBoundary(date, startCutoff, startTimezone);
  // const endTime = getDayBoundary(getNextDate(date), endCutoff, timezone);

  return {
    _id: _id.toString(),
    date: cloneMyDate(date),
    startTime: getDayBoundary(date, startCutoff, startTimezone, sessionTimezone),
    endTime: getDayBoundary(getNextDate(date), endCutoff, timezone, sessionTimezone),
    settings: {
      dayCutoff: convertDayCutoffToMinutes(endCutoff),
      timezone,
      wage: processWage(wage)
    },
    segments: processSegments(segments, sessionTimezone),
    totalTime: getTotalSegmentsDurationInfo(segments)
  };
};


function getDayBoundary(date, rawCutoffValue, timezone, sessionTimezone) {
  const cutoff = convertDayCutoffToMinutes(rawCutoffValue);
  const dayBoundaryTime = getDayCutoffTime(cutoff);
  const dayBoundaryDate = (cutoff >= 0) ? date : getPrecedingDate(date);
  const boundaryUtcTime = getTimestampFromDateAndTime(dayBoundaryDate, dayBoundaryTime, timezone);
  return getTimeInfoFromUtcTime(boundaryUtcTime, sessionTimezone);
}

function getTotalSegmentsDurationInfo(segments) {
  let totalTimeInMsec = 0;
  segments.forEach(({ startTime, endTime }) => {
    const segmentDuration = endTime - startTime;
    totalTimeInMsec += segmentDuration;
  });
  return getDurationInfo(totalTimeInMsec);
}
