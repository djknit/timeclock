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
  const rateError = errors['wage.0.value.rate'];
  if (rateError) {
    problems.wage = { rate: true };
    messages.push(
      (rateError.kind === 'required' && 'Invalid wage. Wage object must include pay rate.') ||
      (rateError.name === 'CastError' && 'Invalid pay rate; not a number.') ||
      rateError.message
    );
  }
  const wageError = errors['wage.0.value'];
  if (wageError && wageError.kind === 'user defined') {
    problems.wage = (wageError.message || '').indexOf('overtime') === -1 ? { rate: true } : { overtime: { rate: true } };
    const isRateMissing = (wageError.value && !wageError.value.rate) || false;
    if (isRateMissing && !rateError) messages.push('Invalid wage; missing pay rate.');
    else if (!isRateMissing) messages.push(wageError.message);
  }

  return err;
}