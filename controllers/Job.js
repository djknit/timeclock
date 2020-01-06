const Job = require('../models/Job');

module.exports = {
  create: newJob => new Promise(
    (resolve, reject) => {
      const { name, timezone, wage, startDate } = newJob;
      console.log(wage)
      if (!name || !timezone || !startDate) {
        const error = new Error('Missing required data properties.');
        reject(error);
        throw(error);
      }
      newJob.timezone = [{
        value: timezone
      }];
      if (wage) {
        newJob.wage = [{
          value: wage
        }];
      }
      else newJob.wage = [{value: null}]
      Job.create(newJob)
      .then(resolve)
      .catch(err => {
        reject(determineCreateJobError(err));
      });
    }
  )
};

function determineCreateJobError(err) {
  if (!err) err = {};
  const { errors } = err;

  let problems = {};
  let messages = [];

  if (errors.startDate) {
    problems.startDate = true;
    messages.push('Invalid start date.');
  }
  if (errors['timezone.0.value']) {
    problems.timezone = true;
    messages.push('Invalid timezone.');
  }
  if (errors.weekBegins) {
    problems.weekBegins = true;
    messages.push('Invalid week cutoff. Must be an integer 0 - 6. Sunday is 0, Monday is 1, etc.');
  }
  if (errors.dayCutoff) {
    problems.dayCutoff = true;
    messages.push('Invalid day cutoff. Must be between -12 hours and 12 hours.');
  }
  const wageError = errors['wage.0.value'];
  if (wageError) problems.wage = {};
  if (wageError && wageError.kind === 'user defined') {
    determineUserDefinedWageError(wageError, problems.wage, messages);
  }
  const rateError = errors['wage.0.value.rate'];
  if (rateError) {
    problems.wage.rate = true;
    messages.push(
      (rateError.kind === 'required' && 'Invalid wage. Wage object must include pay rate.') ||
      (rateError.name === 'CastError' && 'Invalid pay rate; not a number.') ||
      rateError.message
    );
  }
  const overtimeError = errors['wage.0.value.overtime'];
  if (overtimeError) {
    problems.wage.overtime = problems.wage.overtime || {};
  }
  if (overtimeError && overtimeError.kind === 'user defined') {
    problems.wage.overtime.rate = true;
    problems.wage.overtime.useMultiplier = true;
    messages.push(overtimeError.message);
  }
  if (errors['wage.0.value.overtime.rate']) {
    problems.wage.overtime.rate = true;
    messages.push('Invalid overtime wage.');
  }
  if (errors['wage.0.value.overtime.useMultiplier']) {
    problems.wage.overtime.rate = true;
    messages.push('Invalid overtime; invalid `useMultiplier` value.');
  }
  const overtimeCutoffError = errors['wage.0.value.overtime.cutoff'];
  if (overtimeCutoffError) {
    problems.wage.overtime.cutoff = true;
    if (overtimeCutoffError.message.indexOf('integer') !== -1) {
      overtimeCutoffError.message = 'Invalid overtime cutoff. ' + overtimeCutoffError.message;
    }
    messages.push(
      overtimeCutoffError.kind === 'user defined' ?
        overtimeCutoffError.message :
        'Invalid overtime cutoff.'
    );
  }

  if (messages.length > 0) {
    return {
      problems,
      status: 422,
      messages
    };
  }

  return err;
}

function determineUserDefinedWageError(wageError, wageProblems, messages) {
  const errorMessage = wageError.message || '';
  if (errorMessage.indexOf('currency') !== -1) {
    wageProblems.currency = true;
  }
  else if (errorMessage.indexOf('overtime') !== -1) {
    wageProblems.overtime = wageProblems.overtime || {};
    wageProblems.overtime.rate = true;
  }
  else {
    wageProblems.rate = true;
  }
  messages.push(errorMessage);
}