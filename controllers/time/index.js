const WeekController = require('../Week');
const JobController = require('../Job');
const segmentsController = require('./segments');
const daysController = require('./days');
const weeksController = require('./weeks');

const { getUtcMoment } = require('../../utilities');

module.exports = {
  days: daysController,
  segments: segmentsController,
  weeks: weeksController,
  addSegmentToDay,
  addSegment,
  deleteSegmentsInDateRange,
  deleteSegmentsForDates
};

function addSegmentToDay(segment, dayId, weekId, userId) {
  return new Promise(
    (resolve, reject) => {
      // first make sure segment itself is valid; then find week; then do following steps
      if (!segmentsController.isSegmentValid(segment)) {
        let err = new Error('Invalid segment. Segments must have both a `startTime` and `endTime`, and the `startTime` must be less than the `endTime`.');
        err.problems = {
          segment: {
            startTime: true,
            endTime: true
          }
        };
        err.status = 422;
        return reject(err);
      }
      console.log(weekId);
      console.log(dayId)
      WeekController.getById(weekId, userId)
      .then(weekDoc => {
        console.log('@ @ &&&&&&\ni i i i i');
        console.log(weekDoc);
        // make sure week belongs to user
        // make sure day belongs to week
        if (!weekDoc) {
          let err = new Error('No week found with `weekId`.');
          err.problems = { weekId: true };
          err.status = 422;
          throw err;
        }
        const day = daysController.findDayWithId(dayId, weekDoc.days);
        if (!day) {
          let err = new Error('No day found with `dayId` in week with `weekId`.');
          err.problems = { dayId: true };
          err.status = 422;
          throw err;
        }
        // * * * make sure segment falls within day and does not overlap with existing segments * * *
        console.log('// add seg to day')
        return WeekController.addSegmentToDay(segment, dayId, weekId, userId);
      })
      .then(resolve)
      .catch(reject);
    }
  );
}

function addSegment(segment, jobId, userId) {
  return new Promise(
    (resolve, reject) => {
      // get job by id (w/ weeks populated)
      let weekId, dayId, job;
      JobController.getJobById(jobId, userId)
      // get day and week ids
      .then(_job => {
        job = _job;
        return segmentsController.getDayAndWeekIdsForNewSegment(segment, job);
      })
      .then(ids => {
        weekId = ids.weekId;
        dayId = ids.dayId;
        return weeksController.findWeekWithId(weekId, job);
      })
      .then(weekDoc => {
        return WeekController.addSegmentToDay(segment, dayId, weekId, userId);
      })
      .then(updatedWeekDoc => {
        const weeks = job.weeks;
        for (let i = 0; i < weeks.length; i++) {
          let week = weeks[i];
          if (updatedWeekDoc._id === week.document._id) {
            week.document = updatedWeekDoc;
            return resolve(job);
          }
        }
      });
    }
  );
}

function deleteSegmentsInDateRange(firstDate, lastDate, jobId, userId) {
  return new Promise((resolve, reject) => {
    const firstDateTime = getUtcMoment(firstDate).valueOf();
    const lastDateTime = getUtcMoment(lastDate).valueOf();
    console.log('** * * **');
    console.log(firstDateTime)
    console.log(lastDateTime)
    if (firstDateTime > lastDateTime) {
      let err = new Error('Invalid date range; `firstDate` is later than `lastDate`.');
      err.status = 400;
      err.problems = {
        firstDate: true,
        lastDate: true
      };
      return reject(err);
    }
    let job;
    JobController.getJobById(jobId, userId)
  // find weeks affected
  // update each week
  // return updated job
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
    dates.forEach();
  });
}