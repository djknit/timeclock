const {
  segments: segmentsController,
  days: daysController,
} = require('../timePieces');

const { checkForFailure } = require('../utilities');

module.exports = {
  ensureSegmentIsValid,
  ensureSegmentIsInDay,
  ensureNewSegDoesntOverlap
};


function ensureSegmentIsValid(segment, segPropName) {
  const invalidSegMsg = 'Invalid segment. Segments must have both a `startTime` and `endTime`, and the `startTime` must be less than the `endTime`.';
  const segProbs = { startTime: true, endTime: true };
  const invalidSegProblemsObj = getProbsObj(segProbs, segPropName)
  checkForFailure(!segmentsController.isSegmentValid(segment), invalidSegMsg, invalidSegProblemsObj, 422);
}

function ensureSegmentIsInDay(segment, day, segPropName) {
  const isSegmentInDay = daysController.isSegmentInDay(day, segment);
  const segNotInDayMsg = 'The segment includes time that is not part of the specified day.';
  const segProbs = {
    startTime: !(isSegmentInDay.startTime),
    endTime: !(isSegmentInDay.endTime)
  };
  const segNotInDayProblemsObj = getProbsObj(segProbs, segPropName);
  checkForFailure(!isSegmentInDay, segNotInDayMsg, segNotInDayProblemsObj, 422);
}

function ensureNewSegDoesntOverlap(segment, day, segPropName) { // also for updated segment
  const segId = segment._id && segment._id.toString();
  const otherSegs = day.segments.filter(({ _id }) => _id.toString() !== segId);
  const doesOverlap = segmentsController.doesNewSegOverlapExistingSegs(otherSegs, segment);
  const varMsgWords = segment._id ? (
    ['updated', 'the update would cause it to overlap']
  ) : (
    ['added', 'it overlaps']
  );
  const segOverlapMsg = (
    `Segment could not be ${varMsgWords[0]} because ${varMsgWords[1]} with one or more existing segment(s).`
  );
  const segProbs = {
    startTime: doesOverlap.startTime,
    endTime: doesOverlap.endTime
  };
  const segOverlapProblemsObj = getProbsObj(segProbs, segPropName);
  checkForFailure(doesOverlap, segOverlapMsg, segOverlapProblemsObj, 422);
}

function getProbsObj(segProblems, segPropName = 'segment') {
  return { [segPropName]: segProblems };
}
