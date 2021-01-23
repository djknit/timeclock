import {
  dates as dateUtils,
  jobData as jobDataUtils
} from '../../../../utilities';
import { getTimestampFromDateAndTime } from '../dateTime';
import { getSegmentBoundaryDayDates } from './elemental';

const { areDatesEquivalent, getNextDate } = dateUtils;
const { getDateForTime, getBoundariesOfDayWithDate } = jobDataUtils;

function processTimeSegmentInput(
  { startDate, endDate, startTime, endTime }, timezone, job
) {

  const processedSegment = {
    startTime: getTimestampFromDateAndTime(startDate, startTime, timezone),
    endTime: getTimestampFromDateAndTime(endDate, endTime, timezone)
  };

  const boundaryDays = getSegmentBoundaryDayDates(
    { startDate, endDate, startTime, endTime }, timezone, job
  );

  if (areDatesEquivalent(boundaryDays.firstDay, boundaryDays.lastDay)) {
    return {
      isSplit: false,
      segment: processedSegment
    };
  }

  return {
    isSplit: true,
    segments: splitByDays(processedSegment, job)
  };
}

function splitByDays(processedSegment, job) {
  const { startTime, endTime } = processedSegment;
  const { settings } = job;
  const segFirstDayDate = getDateForTime(startTime, settings, true);

  let resultSegments = [];
  _splitOffNextSeg(segFirstDayDate, startTime);
  return resultSegments;

  function _splitOffNextSeg(_segDate, _segStartTime) {
    const _dayEnd = getBoundariesOfDayWithDate(_segDate, settings).endTime;
    const _doesSegEndToday = endTime <= _dayEnd;
    resultSegments.push({
      startTime: _segStartTime,
      endTime: _doesSegEndToday ? endTime : _dayEnd
    });
    if (!_doesSegEndToday) {
      const _nextDate = getNextDate(_segDate);
      _splitOffNextSeg(_nextDate, _dayEnd);
    }
  }
}

export { processTimeSegmentInput };
