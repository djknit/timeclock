import { getTimeInputProblems } from '../../time';
import { getWholeSegmentProblems } from './wholeSegment';
import { addProblemsObjToExisting } from './merging';

function timeSegInputProblemsGetterFactory() {
  return function () {
    console.log('input problems')
    let { problems, problemMessages } = getIndividualInputProblems(this.state);
    console.log('individual probs:\n', problems, problemMessages)
    if (problemMessages.length === 0) {
      const _wholeSegProbs = getWholeSegmentProblems(this.state, problemMessages, this.props.job);
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

export { timeSegInputProblemsGetterFactory };
