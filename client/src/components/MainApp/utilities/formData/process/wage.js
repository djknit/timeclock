import { processCurrencyInputValue, constants } from '../../../../utilities';

const { minsPerHr, secsPerMin } = constants;

function getWageInputProblems(inputValue, problemMessages) {
  const { useWage, rate, currency, overtime } = inputValue;
  if (useWage === false) return;
  if (!useWage) {
    problemMessages.push('Missing response to "Track Pay."');
    return { useWage: true };
  }
  let problems = {};
  let _probMsgs = [];
  if (!currency) {
    problems.currency = true;
    _probMsgs.push('Missing wage currency.');
  }
  if (!isRawValueNonNegativeNum(rate)) {
    problems.rate = true;
    _probMsgs.push('Missing or invalid pay rate.');
  }
  problems.overtime = getOvertimeInputProblems(inputValue, _probMsgs);
  problemMessages.push(..._probMsgs);
  return _probMsgs.length > 0 ? problems : undefined;
}

function getOvertimeInputProblems(wageInputValue, problemMessages) {
  const { useOvertime, useMultiplier, multiplier, rate, cutoff } = wageInputValue.overtime;
  if (useOvertime === false) return;
  if (!useOvertime) {
    problemMessages.push('Missing response for overtime on/off input.');
    return { useOvertime: true };
  }
  let problems = {};
  let _probMsgs = [];
  if (useMultiplier && !isRawValueNonNegativeNum(multiplier)) {
    problems.multiplier = true;
    _probMsgs.push('Missing or invalid overtime pay rate multiplier.');
  }
  if (!useMultiplier && useMultiplier !== false) {
    problems.useMultiplier = true;
    _probMsgs.push('Missing response for whether or not overtime pay is calculated using a multiplier.');
  }
  else if (!useMultiplier && !isRawValueNonNegativeNum(rate)) {
    problems.rate = true;
    _probMsgs.push('Missing or invalid overtime pay rate.');
  }
  if (!cutoff.hours && cutoff.hours !== 0 && !cutoff.minutes && cutoff.minutes !== 0) {
    problems.cutoff = true;
    _probMsgs.push('Missing overtime cutoff value.');
  }
  const cutoffMin = cutoff.minutes || 0;
  const cutoffHr = cutoff.hours || 0;
  if (cutoffMin < 0 || cutoffMin > 59 || cutoffHr < 0 || cutoffHr > 167 || cutoffHr + cutoffMin === 0) {
    problems.cutoff = true;
    _probMsgs.push('Invalid overtime cutoff value.');
  }
  problemMessages.push(..._probMsgs);
  return _probMsgs.length > 0 ? problems : undefined;
}

function processWageInput(wageInputValue) {
  const { useWage, rate, currency, overtime } = wageInputValue;
  if (!useWage) return null;
  return {
    currency,
    rate: processCurrencyInputValue(rate).rounded,
    overtime: processOvertimeInput(overtime)
  };
}

function processOvertimeInput(overtimeInputValue) {
  const { useOvertime, useMultiplier, rate, multiplier, cutoff } = overtimeInputValue;
  if (!useOvertime) return;
  let result = { useMultiplier };
  if (useMultiplier) {
    result.multiplier = multiplier;
  }
  else {
    result.rate = processCurrencyInputValue(rate).rounded;
  }
  const cutoffInMinutes = (cutoff.hours || 0) * minsPerHr + (cutoff.minutes || 0);
  result.cutoff = cutoffInMinutes * secsPerMin * 1000;
  return result;
}

function isRawValueNonNegativeNum(rawInputValue) {
  const parsedValue = parseFloat(rawInputValue);
  return (parsedValue || parsedValue === 0) && parsedValue >= 0;
}

export { getWageInputProblems, processWageInput };