import { processCurrencyInputValue } from './currency';

function validateWageInput(inputValue) {
  const { useWage, rate, currency, overtime } = inputValue;
  if (useWage === false) return;
  if (!useWage) {
    return {
      problems: { useWage: true },
      problemMessages: ['Missing response to "Track Pay."']
    };
  }
  let problems = {};
  let problemMessages = [];
  if (!currency) {
    problems.currency = true;
    problemMessages.push('Missing wage currency.');
  }
  if (!isRawValueNonNegativeNum(rate)) {
    problems.rate = true;
    problemMessages.push('Missing or invalid pay rate.');
  }
  const overtimeProblemsInfo = validateOvertimeInput(inputValue);
  if (overtimeProblemsInfo) {
    problems.overtime = overtimeProblemsInfo.problems;
    problemMessages.push(...overtimeProblemsInfo.problemMessages);
  }
  return (
    problemMessages.length > 0 ?
    { problems, problemMessages } :
    undefined
  );
}

function validateOvertimeInput(wageInputValue) {
  const { useOvertime, useMultiplier, multiplier, rate, cutoff } = wageInputValue.overtime;
  if (useOvertime === false) return;
  if (!useOvertime) {
    return {
      problems: { useOvertime: true },
      problemMessages: ['Missing response for overtime on/off input.']
    };
  }
  let problems = {};
  let problemMessages = [];
  if (useMultiplier && !isRawValueNonNegativeNum(multiplier)) {
    problems.multiplier = true;
    problemMessages.push('Missing or invalid overtime pay rate multiplier.');
  }
  if (!useMultiplier && useMultiplier !== false) {
    problems.useMultiplier = true;
    problemMessages.push('Missing response for whether or not overtime pay is calculated using a multiplier.');
  }
  else if (!useMultiplier && !isRawValueNonNegativeNum(rate)) {
    problems.rate = true;
    problemMessages.push('Missing or invalid overtime pay rate.');
  }
  if (!cutoff.hours && cutoff.hours !== 0 && !cutoff.minutes && cutoff.minutes !== 0) {
    problems.cutoff = true;
    problemMessages.push('Missing overtime cutoff value.');
  }
  const cutoffMin = cutoff.minutes || 0;
  const cutoffHr = cutoff.hours || 0;
  if (cutoffMin < 0 || cutoffMin > 59 || cutoffHr < 0 || cutoffHr > 167 || cutoffHr + cutoffMin === 0) {
    problems.cutoff = true;
    problemMessages.push('Invalid overtime cutoff value.');
  }
  return (
    problemMessages.length > 0 ?
    { problems, problemMessages } :
    undefined
  );
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
  const cutoffInMinutes = (cutoff.hours || 0) * 60 + (cutoff.minutes || 0);
  result.cutoff = cutoffInMinutes * 60 * 1000;
  return result;
}

function isRawValueNonNegativeNum(rawInputValue) {
  const parsedValue = parseFloat(rawInputValue);
  return (parsedValue || parsedValue === 0) && parsedValue >= 0;
}

export { validateWageInput, processWageInput };