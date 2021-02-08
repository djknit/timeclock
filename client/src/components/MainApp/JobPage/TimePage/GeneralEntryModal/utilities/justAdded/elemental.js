function doesSegmentMatchInfo(segment, segmentInfo) {
  const segmentOriginVal = _getSegOriginalValue(segment);
  const segmentInfoSegOriginVal = _getSegOriginalValue(segmentInfo);
  return (
    (segmentInfo._id && (segment._id === segmentInfo._id)) ||
    (
      _getTime(segment.created.time) === _getTime(segmentInfo.created.time) &&
      segment.created.method === segmentInfo.created.method &&
      segmentOriginVal.startTime === segmentInfoSegOriginVal.startTime &&
      segmentOriginVal.endTime === segmentInfoSegOriginVal.endTime
    )
  );
  function _getTime(_time) {
    return parseInt(_time) === _time ? _time : _time.utcTime;
  }
  function _getSegOriginalValue({ startTime, endTime, modified }) {
    if (modified && modified.length > 0) return { ...modified[0].previousValue };
    return {
      startTime: _getTime(startTime),
      endTime: _getTime(endTime)
    };
  }
}

export {
  doesSegmentMatchInfo,
};
