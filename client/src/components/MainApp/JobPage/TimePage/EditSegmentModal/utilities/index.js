import {
  processTimeSegmentInput,
  getSegmentDate,
  dates as dateUtils
} from '../../utilities';
export * from '../../utilities';

const { areDatesEquivalent } = dateUtils;

function processEditSegmentInput(
  inputValues,
  { job, segmentToEdit, segToEditWeekId, segToEditDayId }
) {
  const { sessionTimezone } = job.time;
  const processedInput = processTimeSegmentInput(inputValues, sessionTimezone);
  const freshSegs = processedInput.segments || [processedInput.segment];
  const segmentDate = getSegmentDate({ startTime: segmentToEdit.startTime.utcTime });
  const { updatedSegment, fragments } = sortFreshSegs(freshSegs, segmentDate);
  return {
    segmentId: segmentToEdit._id.toString(),
    weekId: segToEditWeekId,
    dayId: segToEditDayId,
    updatedTimes: updatedSegment,
    fragments
  };
}

function sortFreshSegs(freshSegs, segmentDate) {
  for (let i = 0; i < freshSegs.length; i++) {
    const currentSeg = freshSegs[i];
    if (areDatesEquivalent(segmentDate, getSegmentDate(currentSeg))) {
      freshSegs.splice(i, 1);
      return {
        updatedSegment: currentSeg,
        fragments: (freshSegs && freshSegs.length > 0) ? freshSegs : undefined
      };
    }
  }
}
