const Job = require('../../models/Job');

const { jobNotFoundCheckerFactory } = require('./utilities');

module.exports = {
  addWeek
};

function addWeek(week, jobId) {
  return new Promise(
    (resolve, reject) => {
      // Job.findById(jobId).then(result=>console.log(result))
      console.log('adding week...')
      console.log(week);
      console.log('+ +  +   +    +     +      +')
      // console.log(jobId)
      Job.findByIdAndUpdate(
        jobId,
        {
          $push: {
            weeks: week
          }
        },
        { new: true }
      )
      .populate('weeks.document')
      .then(jobNotFoundCheckerFactory(jobId))
      .then(job => {console.log(job); resolve(job)})
      .catch(err => {
        // console.log(('=*'.repeat(30) + '\n').repeat(3));
        // console.error(err);
        // console.log('ADD WEEK ERROR');
        const reason = err && err.reason && err.reason.reason && err.reason.reason;
        // console.log(reason);
        reject(err);
      });
    }
  );
}