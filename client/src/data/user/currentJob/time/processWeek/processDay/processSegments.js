import {
  getTimeInfoFromUtcTime,
  getDurationInfo
} from '../../utilities';

export default function processSegments(segments, timezone) {

  function _processSegment({ _id, startTime, endTime }) {
    return {
      _id: _id.toString(),
      startTime: getTimeInfoFromUtcTime(startTime, timezone),
      endTime: getTimeInfoFromUtcTime(endTime, timezone),
      duration: getDurationInfo(endTime - startTime)
    };
  }

  return segments.map(_processSegment);
};