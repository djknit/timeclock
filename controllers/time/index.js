const WeekController = require('../Week');
const JobController = require('../Job');
const segmentsController = require('./segments');
const weeksController = require('./weeks');

module.exports = {
  days: require('./days'),
  segments: require('./segments'),
  weeks: require('./weeks'),
  addSegmentToDay: (segment, dayId, weekId, userId) => new Promise(
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
  ),
  addSegment: (segment, jobId, userId) => new Promise(
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
  )
};