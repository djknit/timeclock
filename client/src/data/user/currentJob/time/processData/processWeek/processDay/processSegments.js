import {
  getTimeInfoFromUtcTime,
  getDurationInfo
} from '../../../utilities';

export default function processSegments(segments, timezone) {

  function _processSegment({ _id, startTime, endTime, created, modified }) {
    return {
      _id: _id.toString(),
      startTime: getTimeInfoFromUtcTime(startTime, timezone),
      endTime: getTimeInfoFromUtcTime(endTime, timezone),
      duration: getDurationInfo(endTime - startTime),
      created: {
        time: created.time && getTimeInfoFromUtcTime(created.time),
        method: created.method
      },
      modified: modified && modified.map(
        modInfo => ({
          time: getTimeInfoFromUtcTime(modInfo.time, timezone),
          method: modInfo.method,
          previousValue: { ...modInfo.previousValue }
        })
      )
    };
  }

  return segments.map(_processSegment);
};