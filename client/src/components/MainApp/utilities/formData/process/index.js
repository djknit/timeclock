import { getWageInputProblems } from './wage';
import { getDayCutoffInputProblems } from './dayCutoff';

export * from './wage';
export * from './dayCutoff';

function getWeekBeginsInputProblems(inputValue, problemMessages, isWkDayCutoffs) {
  if (!inputValue && inputValue !== 0) {
    problemMessages.push(
      isWkDayCutoffs ?
      'Missing week begins day (under "Week and Day Cutoffs").' :
      'Missing week begins day.'
    );
    return true;
  }
}

function getTimezoneInputProblems(inputValue, problemMessages) {
  if (!inputValue) {
    problemMessages.push('You must select a timezone.');
    return true;
  }
}

function getJobSettingInputProblems(settingName, inputValue, problemMessages) {
  const _jobSettingValidators = {
    timezone: getTimezoneInputProblems,
    wage: getWageInputProblems,
    weekBegins: getWeekBeginsInputProblems,
    dayCutoff: getDayCutoffInputProblems
  };

  return _jobSettingValidators[settingName](inputValue, problemMessages);
}

export {
  getWeekBeginsInputProblems,
  getTimezoneInputProblems,
  getJobSettingInputProblems
};