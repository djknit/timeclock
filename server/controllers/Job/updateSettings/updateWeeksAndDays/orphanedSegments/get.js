const { days: daysController } = require('../../../../timePieces');

module.exports = getOrphanedSegments;

function getOrphanedSegments(day) {
  // Since changing `dayCutoff` or `timezone` changes day start and end times, this function checks to see if part or all of any segment(s) no longer fall within the day they are assigned to
  let orphanedSegments = [];
  let indexesOfSegmentsToRemove = [];
  const dayStartTime = daysController.getDayStartTime(day);
  const dayEndTime = daysController.getDayEndTime(day);

  day.segments.forEach((segment, index) => {
    const { startTime, endTime, createdAt } = segment;
    const commonOrphanedSegProps = {
      createdAt,
      modifiedAt: {
        time: Date.now(),
        previousValue: { startTime, endTime }
      }
    };
    if (
      (startTime < dayStartTime && endTime <= dayStartTime) ||
      (startTime >= dayEndTime && endTime > dayEndTime)
    ) {
      orphanedSegments.push(segment);
      indexesOfSegmentsToRemove.push(index);
      return;
    }
    if (startTime < dayStartTime) {
      orphanedSegments.push({
        startTime: startTime,
        endTime: dayStartTime,
        ...commonOrphanedSegProps
      });
      segment.startTime = dayStartTime;
    }
    if (endTime > dayEndTime) {
      orphanedSegments.push({
        startTime: dayEndTime,
        endTime: endTime,
        ...commonOrphanedSegProps
      });
      segment.endTime = dayEndTime;
    }
  });

  day.segments = day.segments.filter((seg, index) => indexesOfSegmentsToRemove.indexOf(index) === -1);
  return orphanedSegments;
}
