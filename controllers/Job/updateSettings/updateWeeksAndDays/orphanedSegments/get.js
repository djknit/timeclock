const daysController = require('../../../../time/days');

module.exports = getOrphanedSegments;

function getOrphanedSegments(day) {
  // Since changing `dayCutoff` or `timezone` changes day start and end times, this function checks to see if part or all of any segment(s) no longer fall within the day they are assigned to
  let orphanedSegments = [];
  const dayStartTime = daysController.getDayStartTime(day);
  const dayEndTime = daysController.getDayEndTime(day);
  day.segments.forEach(segment => {
    const { startTime, endTime } = segment;
    if (startTime < dayStartTime) {
      orphanedSegments.push({
        startTime: startTime,
        endTime: dayStartTime
      });
      segment.startTime = dayStartTime;
    }
    if (endTime > dayEndTime) {
      orphanedSegments.push({
        startTime: dayEndTime,
        endTime: endTime
      });
      segment.endTime = dayEndTime;
    }
  });
  return orphanedSegments;
}