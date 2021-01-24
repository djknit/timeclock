import { getTimeInputProblems } from '../../time';
import { getWholeSegmentProblems } from './wholeSegment';
import { addProblemsObjToExisting } from './merging';

function inputProblemsGetterFactory() {
  return function () {
    const { state, props: { job } } = this;
    const timezone = job.time.sessionTimezone;
    let { problems, problemMessages } = getIndividualInputProblems(state);
    if (problemMessages.length === 0) {
      const _wholeSegProbs = getWholeSegmentProblems(state, problemMessages, timezone);
      addProblemsObjToExisting(problems, _wholeSegProbs);
    }
    return { problems, problemMessages };
  };
}

function getIndividualInputProblems(inputValues) {
  const { startDate, endDate, startTime, endTime } = inputValues;
  let problems = {};
  let problemMessages = [];
  if (!startDate) {
    problems.startDate = true;
    problemMessages.push('You must enter the date that the time segment begins.');
  }
  if (!endDate) {
    problems.endDate = true;
    problemMessages.push('You must enter the date that the time segment ends.');
  }
  problems.startTime = getTimeInputProblems(startTime, problemMessages, 'start');
  problems.endTime = getTimeInputProblems(endTime, problemMessages, 'end');
  return { problems, problemMessages };
}

export { inputProblemsGetterFactory };
