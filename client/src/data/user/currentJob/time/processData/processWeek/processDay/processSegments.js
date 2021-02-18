import {
  getTimeInfoFromUtcTime,
  getDurationInfo
} from '../../utilities';

export default function processSegments(segments, outputTimezones) {

  return segments.map(_processSegment);

  function _processSegment({ _id, startTime, endTime, created, modified }) {
    return {
      _id: _id.toString(),
      startTime: _getTimeInfo(startTime),
      endTime: _getTimeInfo(endTime),
      duration: getDurationInfo(endTime - startTime),
      created: {
        time: created.time && _getTimeInfo(created.time),
        method: created.method
      },
      modified: modified && modified.map(
        modInfo => ({
          time: _getTimeInfo(modInfo.time),
          method: modInfo.method,
          previousValue: { ...modInfo.previousValue }
        })
      )
    };
  }

  function _getTimeInfo(_utcTime) {
    return getTimeInfoFromUtcTime(_utcTime, outputTimezones.primary, outputTimezones.alt);
  }
};
