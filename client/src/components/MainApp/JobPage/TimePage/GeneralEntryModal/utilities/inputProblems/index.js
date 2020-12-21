import { getTimeInputProblems } from '../../../utilities';
import { getWholeSegmentProblems } from './wholeSegment';
import { addProblemsObjToExisting } from './merging';

function inputProblemsGetterFactory() {
  return function() {
    const { job } = this.props;
    const { startDate, endDate, startTime, endTime } = this.state;
    const timezone = job.time.sessionTimezone;
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
    if (problemMessages.length === 0) {
      const _wholeSegProbs = getWholeSegmentProblems(this.state, problemMessages, timezone, job);
      addProblemsObjToExisting(problems, _wholeSegProbs);
    }
    return { problems, problemMessages };
  };
}

export { inputProblemsGetterFactory };
