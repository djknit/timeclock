function findSegmentsFromSegmentInfo(segmentsInfo, weeks) {
  return segmentsInfo.map(segmentInfo => {
    const { dayId, weekId } = segmentInfo;
    const weekWithSeg = findItemWithId(segmentInfo.weekId, weeks, 'weekDocId');
    const dayWithSeg = findItemWithId(segmentInfo.dayId, weekWithSeg.days);
    return {
      ...findSegmentOnDay(dayWithSeg.segments, segmentInfo),
      dayId,
      weekId,
      date: dayWithSeg.date
    };
  });
}

function findItemWithId(id, array, idPropName = '_id') {
  for (let i = 0; i < array.length; i++) {
    if (array[i][idPropName] === id.toString()) {
      return array[i];
    }
  }
}

function findSegmentOnDay(daySegments, segmentInfo) {
  for (let i = 0; i < daySegments.length; i++) {
    if (doesSegmentMatchInfo(daySegments[i], segmentInfo)) {
      return daySegments[i];
    }
  }
}

function doesSegmentMatchInfo(segment, segmentInfo) {
  return (
    segment.created.time.utcTime === segmentInfo.created.time &&
    segment.created.method === segmentInfo.created.method &&
    (
      (
        segment.startTime.utcTime === segmentInfo.startTime &&
        segment.endTime.utcTime === segmentInfo.endTime
      ) ||
      (
        !!segment.modified &&
        segment.modified.length > 0 &&
        segment.modified[0].previousValue.startTime === segmentInfo.startTime &&
        segment.modified[0].previousValue.endTime === segmentInfo.endTime
      )
    )
  );
}

export { findSegmentsFromSegmentInfo };
