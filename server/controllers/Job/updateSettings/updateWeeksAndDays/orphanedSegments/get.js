const { days: daysController } = require('../../../../timePieces');

module.exports = getOrphanedSegments;

function getOrphanedSegments(day, segModificationMethodName) {
  // Since changing `dayCutoff` or `timezone` changes day start and end times, this function checks to see if part or all of any segment(s) no longer fall within the day they are assigned to
  let orphanedSegments = [];
  let indexesOfSegmentsToRemove = [];
  const dayStartTime = daysController.getDayStartTime(day);
  const dayEndTime = daysController.getDayEndTime(day);

  day.segments.forEach((segment, index) => {
    const { startTime, endTime } = segment;
    const _markSegModified = () => {
      segment.modified.push({
        time: Date.now(),
        previousValue: { startTime, endTime },
        method: segModificationMethodName
      });
    };
    if (
      (startTime < dayStartTime && endTime <= dayStartTime) ||
      (startTime >= dayEndTime && endTime > dayEndTime)
    ) {
      orphanedSegments.push(segment._doc);
      indexesOfSegmentsToRemove.push(index);
      return;
    }
    if (startTime < dayStartTime) {
      _markSegModified();
      orphanedSegments.push({
        ...segment._doc,
        _id: undefined,
        endTime: dayStartTime
      });
      segment.startTime = dayStartTime;
    }
    if (endTime > dayEndTime) {
      _markSegModified();
      orphanedSegments.push({
        ...segment._doc,
        _id: undefined,
        startTime: dayEndTime
      });
      segment.endTime = dayEndTime;
    }
  });

  day.segments = day.segments.filter((seg, index) => indexesOfSegmentsToRemove.indexOf(index) === -1);
  return orphanedSegments;
}
