import { getWageInputProblems, processWageInput } from './wage';
import { getDayCutoffInputProblems, processDayCutoffInput } from './dayCutoff';

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

function processJobSettingInputValue(settingName, inputValue) {
  switch (settingName) {
    case 'wage':
      return processWageInput(inputValue);

    case 'dayCutoff':
      return processDayCutoffInput(inputValue);
    
    case 'weekBegins':
      return parseInt(inputValue);

    default:
      return inputValue;

  }
}

export {
  getWeekBeginsInputProblems,
  getTimezoneInputProblems,
  getJobSettingInputProblems,
  processJobSettingInputValue
};