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
    hasProblem = true;
    problems.is24hr = true;
    _addProbMsg('missing "24 hr or AM/PM" input value.');
  }

  if (!minute && minute !== 0) {
    hasProblem = true;
    problems.minute = true;
    _addProbMsg('missing minute');
  }
  else if (minute < 0 || minute > 59 || Math.floor(minute) !== minute) {
    hasProblem = true;
    problems.minute = true;
    _addProbMsg('invalid minute value');
  }

  if (!hour && hour !== 0) {
    hasProblem = true;
    problems.hour = true;
    _addProbMsg('missing hour');
  }
  else if (
    hour < 0 || hour > 23 ||
    (!is24hr && (hour < 1 || hour > 12)) ||
    Math.floor(hour) !== hour
  ) {
    hasProblem = true;
    problems.hour = true;
    _addProbMsg('invalid hour value');
  }

  if (!is24hr && !amPm) {
    hasProblem = true;
    problems.amPm = true;
    _addProbMsg('missing AM/PM value')
  }

  return hasProblem ? problems : undefined;
}

export { getTimeInputProblems };
