import {
  cloneMyDate,
  convertDayCutoffToMinutes,
  getDayCutoffTime,
  dates as dateUtils,
  getDurationInfo,
  processWage
} from '../../utilities';
import processSegments from './processSegments';

const { getPrecedingDate, getNextDate } = dateUtils;

export default function processDay({
  date, startCutoff, endCutoff, startTimezone, timezone, wage, _id, segments
}) {

  return {
    _id: _id.toString(),
    date: cloneMyDate(date),
    startTime: getDayBoundary(date, startCutoff, startTimezone),
    endTime: getDayBoundary(getNextDate(date), endCutoff, timezone),
    wage: processWage(wage),
    segments: processSegments(segments, timezone),
    totalTime: getTotalSegmentsDurationInfo(segments)
  };
};

function getDayBoundary(date, rawCutoffValue, timezone) {
  const cutoff = convertDayCutoffToMinutes(rawCutoffValue);
  const dayBoundaryTime = getDayCutoffTime(cutoff);
  const dayBoundaryDate = (cutoff >= 0) ? date : getPrecedingDate(date);
  return {
    time: dayBoundaryTime,
    date: dayBoundaryDate,
    timezone
  };
}

function getTotalSegmentsDurationInfo(segments) {
  let totalTimeInMsec = 0;
  segments.forEach(({ startTime, endTime }) => {
    const segmentDuration = endTime - startTime;
    totalTimeInMsec += segmentDuration;
  });
  return getDurationInfo(totalTimeInMsec);
}