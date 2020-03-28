const WeekController = require('../Week');
const JobController = require('../Job');
const segmentsController = require('./segments');
const weeksController = require('./weeks');

const { getUtcMoment } = require('../../utilities');

module.exports = {
  days: require('./days'),
  segments: require('./segments'),
  weeks: require('./weeks'),
  addSegmentToDay,
  addSegment,
  deleteSegmentsInDateRange,
  deleteSegmentsForDates
};

function addSegmentToDay(segment, dayId, weekId, userId) {
  return new Promise(
    (resolve, reject) => {
      // get week by id
      console.log(weekId);
      console.log(dayId)
      WeekController.getById(weekId, userId)
      // add missing props to seg
      .then(weekDoc => {
        console.log('@ @ &&&&&&\ni i i i i');
        console.log(weekDoc);
        segmentsController.addMissingPropsToNewSegment(segment, weekDoc, dayId);
      // add seg to day
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
      JobController.getById(jobId, userId)
      // get day and week ids
      .then(_job => {
        job = _job;
        return segmentsController.getDayAndWeekIdsForNewSegment(segment, job);
      })
      .then(ids => {
        weekId = ids.weekId;
        dayId = ids.dayId;
      // get week that matches week id
        return weeksController.findWeekWithId(weekId, job);
      })
      // add missing props to seg
      .then(weekDoc => {
        segmentsController.addMissingPropsToNewSegment(segment, weekDoc, dayId);
      // add seg to day
      return WeekController.addSegmentToDay(segment, dayId, weekId, userId);
      })
      .then(updatedWeekDoc => {
        const weeks = job.weeks;
        for (let i = 0; i < weeks.length; i++) {
          let weekDoc = weeks[i].data;
          if (updatedWeekDoc._id === weekDoc.document._id) {
            weekDoc.document = updatedWeekDoc;
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
      return weeksController.deleteSegmentsFromWeeksInDateRange(firstDateTime, lastDateTime, job, userId);
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