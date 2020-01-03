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
  // console.log(error);
  return err;
}