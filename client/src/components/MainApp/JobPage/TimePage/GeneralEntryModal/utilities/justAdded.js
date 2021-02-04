function findSegmentsFromSegmentInfo(segmentsInfo, weeks) {
  let result = (
    segmentsInfo
    .map(segmentInfo => {
      const { dayId, weekId, _id } = segmentInfo;
      const weekWithSeg = findItemWithId(segmentInfo.weekId, weeks, 'weekDocId');
      const dayWithSeg = findItemWithId(segmentInfo.dayId, weekWithSeg.days);
      const segment = findSegmentOnDay(dayWithSeg.segments, segmentInfo);
      return segment && {
        ...segment,
        dayId,
        weekId,
        date: dayWithSeg.date,
        _isGenEntryJustAdded: true
      };
    })
    .filter(segment => !!segment)
  );

  console.log(result)
  return removeDuplicateSegs(result);
}

function findItemWithId(id, array, idPropName = '_id') {
  for (let i = 0; i < array.length; i++) {
    if (array[i][idPropName] === id.toString()) {
      return array[i];
    }
  }
}

function findSegmentOnDay(daySegments, segmentInfo) {
  if (segmentInfo._id) return findItemWithId(segmentInfo._id, daySegments);
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

function removeDuplicateSegs(segs) {
  let segIds = [];
  return segs.filter(({ _id }) => {
    const isDup = segIds.includes(_id);
    segIds.push(_id);
    return isDup;
  });
}

export { findSegmentsFromSegmentInfo };
