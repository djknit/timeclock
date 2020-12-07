function getTimeInputProblems(inputValue, problemMessages, displayName) {
  
  const { hour, minute, amPm, is24hr } = inputValue;
  
  let problems = {};
  let hasProblem = false;

  let fullDisplayName = displayName ? `${displayName} time` : 'time';
  
  const _addProbMsg = _msgFragment => {
    hasProblem = true;
    problemMessages.push(`Invalid ${fullDisplayName}: ${_msgFragment}.`);
  };

  if (!is24hr && is24hr !== false) {
    problems.is24hr = true;
    _addProbMsg('missing "24 hr or AM/PM" input value.');
  }

  if (!hour) {
    problems.hour = true;
    _addProbMsg('missing hour');
  }

  if (!minute) {
    problems.minute = true;
    _addProbMsg('missing minute');
  }

  if (minute < 0 || minute > 59 || Math.floor(minute) !== minute) {
    problems.minute = true;
    _addProbMsg('invalid minute value');
  }

  if (
    hour < 0 || hour > 23 ||
    (!is24hr && (hour < 1 || hour > 12)) ||
    Math.floor(hour) !== hour
  ) {
    problems.hour = true;
    _addProbMsg('invalid hour value');
  }

  if (!is24hr && !amPm) {
    problems.amPm = true;
    _addProbMsg('missing AM/PM value')
  }

  return problems;
}

export default getTimeInputProblems;
