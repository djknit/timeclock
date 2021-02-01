const WeekController = require('../Week');
const JobController = require('../Job');
const weeksController = require('../timePieces').weeks;

const { getUtcDateTime } = require('../utilities');

module.exports = {
  deleteSegmentsInDateRange,
  deleteSegmentsForDates,
  deleteSegmentsForDayIds
};

function deleteSegmentsInDateRange(firstDate, lastDate, jobId, userId) {
  return new Promise((resolve, reject) => {
    const firstDateTime = getUtcDateTime(firstDate);
    const lastDateTime = getUtcDateTime(lastDate);
    if (firstDateTime > lastDateTime) {
      let err = new Error('Invalid date range; `firstDate` is later than `lastDate`.');
      err.status = 422;
      err.problems = {
        firstDate: true,
        lastDate: true
      };
      return reject(err);
    }
    let job;
    JobController.getJobById(jobId, userId)
    .then(_job => {
      job = _job;
      return weeksController.deleteSegmentsFromWeeksInDateRange(
        firstDateTime, lastDateTime, job, userId
      );
    })
    .then(resolve)
    .catch(reject);
  });
}

function deleteSegmentsForDates(dates, jobId, userId) {
  return new Promise((resolve, reject) => {
    JobController.getJobById(jobId, userId)
    .then(job => {
      if (!job) throw {
        message: 'Job not found.',
        problems: { jobId: true },
        code: 422
      };
      let weekAndDayIds = weeksController.getWeekAndDayIdsForDates(dates, job.weeks);
      return deleteSegmentsForDaysById(weekAndDayIds, job, userId);
    })
    .then(resolve)
    .catch(reject);
  });
}

function deleteSegmentsForDayIds(weekAndDayIds, jobId, userId) {
  return JobController.getJobById(jobId, userId)
  .then(job => deleteSegmentsForDaysById(weekAndDayIds, job, userId));
}

function deleteSegmentsForDaysById(weekAndDayIds, job, userId) {
  return new Promise((resolve, reject) => {
    let numWeeksCompleted = 0;
    for (let i = 0; i < weekAndDayIds.length; i++) {
      const { weekId, dayIds } = weekAndDayIds[i];
      WeekController.removeSegmentsFromDaysWithIds(dayIds, weekId, userId)
      .then(updatedWeekDoc => {
        const jobWeeksArrIndex = job.weeks.map(week => week.document._id.toString()).indexOf(weekId);
        job.weeks[jobWeeksArrIndex].document = updatedWeekDoc;
        if (++numWeeksCompleted === weekAndDayIds.length) {
          return resolve(job);
        }
      })
      .catch(reject);
    }
  });
}
