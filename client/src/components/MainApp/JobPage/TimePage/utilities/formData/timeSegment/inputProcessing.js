import {
  dates as dateUtils,
  jobData as jobDataUtils
} from '../../../../utilities';
import { getSegmentBoundaryDayDatesAndTimestamps, currentJobSettingsService } from './elemental';

const { areDatesEquivalent, getNextDate } = dateUtils;
const { getBoundariesOfDayWithDate } = jobDataUtils;

function processTimeSegmentInput(
  inputvalues, timezone
) {
  const {
    startUtcTime: startTime,
    endUtcTime: endTime,
    firstDay: firstDayDate,
    lastDay: lastDayDate
  } = getSegmentBoundaryDayDatesAndTimestamps(inputvalues, timezone);
  const processedSegment = { startTime, endTime };
  if (areDatesEquivalent(firstDayDate, lastDayDate)) {
    return {
      isSplit: false,
      segment: processedSegment
    };
  }
  return {
    isSplit: true,
    segments: splitByDays(processedSegment, firstDayDate)
  };
}

function splitByDays(processedSegment, firstDayDate) {
  const { startTime, endTime } = processedSegment;
  const rawSettings = currentJobSettingsService._getRawSchedules();
  let resultSegments = [];
  _splitOffNextSeg(firstDayDate, startTime);
  return resultSegments;
  function _splitOffNextSeg(_segDate, _segStartTime) {
    const _dayEnd = getBoundariesOfDayWithDate(_segDate, rawSettings).endTime;
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
