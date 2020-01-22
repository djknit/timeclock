const Job = require('../../models/Job');

module.exports = {
  addSegmentToDay
}


function addSegmentToDay(segment, dayId, weekId, jobId) {
  const propName = ``
  Job.findByIdAndUpdate(
    jobId,
    {
      $push: {
        [propName]: segment
      }
    }
  )
}