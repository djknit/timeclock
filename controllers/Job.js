const Job = require('../models/Job');

module.exports = {
  create: newJob => new Promise(
    (resolve, reject) => {
      const { name, timezone, wage, dayCutoff, weekBegins, startDate } = newJob;
      if (!name || !timezone || !startDate) {
        const error = new Error('Missing required data properties.');
        reject(error);
        throw(error);
      }
      newJob.timezone = [{
        value: timezone
      }];
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
  let status;

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

  return err;
}