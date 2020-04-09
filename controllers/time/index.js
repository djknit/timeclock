const WeekController = require('../Week');
const JobController = require('../Job');
const segmentsController = require('./segments');
const daysController = require('./days');
const weeksController = require('./weeks');

const { getUtcMoment, checkForFailure } = require('../utilities');

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
      ensureSegmentIsValid(segment);
      WeekController.getById(weekId, userId)
      .then(weekDoc => ensureSegmentCanBeAddedToDay(segment, dayId, weekDoc))
      .then(() => WeekController.addSegmentToDay(segment, dayId, weekId, userId))
      .then(resolve)
      .catch(reject);
    }
  );
}

function addSegment(segment, jobId, userId) {
  return new Promise(
    (resolve, reject) => {
      ensureSegmentIsValid(segment);
      let date, weekDoc, job;
      JobController.getJobById(jobId, userId)
      .then(_job => {
        date = segmentsController.getDateForNewSegment(segment, _job);
        weekDoc = weeksController.findWeekWithDate(date, _job.weeks);
        return weekDoc ? _job : JobController.createAndAddWeekWithDate(date, _job);
      })
      .then(_job => {
        job = _job;
        if (!weekDoc) weekDoc = weeksController.findWeekWithDate(date, job.weeks);
        console.log('\n& & & -- _ -');
        console.log(weekDoc)
        console.log(' -  -  -');
        console.log(date);
        console.log(' -  -  -');
        day = daysController.findDayForDate(date, weekDoc.days);
        ensureNewSegDoesntOverlap(segment, day);
        return WeekController.addSegmentToDay(segment, day._id, weekDoc._id, userId);
      })
      .then(updatedWeekDoc => {
        const weeks = job.weeks;
        for (let i = 0; i < weeks.length; i++) {
          let week = weeks[i];
          if (updatedWeekDoc._id.toString() === week.document._id.toString()) {
            week.document = updatedWeekDoc;
            return resolve(job);
          }
        }
        throw new Error('Unexpected error. Week document not found in weeks array for job.');
      })
      .catch(reject);
    }
  );
}

function deleteSegmentsInDateRange(firstDate, lastDate, jobId, userId) {
  return new Promise((resolve, reject) => {
    console.log('\n\nDELETE SEGS IN RANGE\n')
    const firstDateTime = getUtcMoment(firstDate).valueOf();
    console.log(firstDateTime)
    const lastDateTime = getUtcMoment(lastDate).valueOf();
    console.log(lastDateTime)
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
      const { weeks } = job;
      let weekAndDayIds = weeksController.getWeekAndDayIdsForDates(dates, job.weeks);
      const numWeeksCompleted = 0;
      for (let i = 0; i < weekAndDayIds.length; i++) {
        const { weekId, dayIds } = weekAndDayIds[i];
        WeekController.removeSegmentsFromDaysWithIds(dayIds, weekId, userId)
        .then(updatedWeekDoc => {
          jobWeeksArrIndex = weeks.map(week => week.document._id.toString()).indexOf(weekId);
          job.weeks[jobWeeksArrIndex].document = updatedWeekDoc;
          if (++numWeeksCompleted === weekAndDayIds.length) {
            return resolve(job);
          }
        });
      }
    })
    .catch(reject);
  });
}

function ensureSegmentIsValid(segment) {
  const invalidSegMsg = 'Invalid segment. Segments must have both a `startTime` and `endTime`, and the `startTime` must be less than the `endTime`.';
  const invalidSegProblemsObj = {
    segment: {
      startTime: true,
      endTime: true
    }
  };
  checkForFailure(!segmentsController.isSegmentValid(segment), invalidSegMsg, invalidSegProblemsObj, 422);
}

function ensureSegmentCanBeAddedToDay(segment, dayId, weekDoc) {
  checkForFailure(!weekDoc, 'Week not found.', { weekId: true }, 422);
  const day = daysController.findDayWithId(dayId, weekDoc.days);
  checkForFailure(!day, 'Day not found in the week specified.', { dayId: true }, 422);
  const isSegmentInDay = daysController.isSegmentInDay(day, segment);
  const segNotInDayMsg = 'The segment includes time that is not part of the specified day.';
  const segNotInDayProblemsObj = {
    segment: {
      startTime: !(isSegmentInDay.startTime),
      endTime: !(isSegmentInDay.endTime)
    }
  };
  checkForFailure(!isSegmentInDay, segNotInDayMsg, segNotInDayProblemsObj, 422);
  ensureNewSegDoesntOverlap(segment, day);
}

function ensureNewSegDoesntOverlap(segment, day) {
  const doesNewSegOverlapExistingSegs = segmentsController.doesNewSegOverlapExistingSegs(day.segments, segment);
  const segOverlapMsg = 'Segment could not be added because it overlaps with one or more existing segment(s).';
  const segOverlapProblemsObj = {
    segment: {
      startTime: doesNewSegOverlapExistingSegs.startTime,
      endTime: doesNewSegOverlapExistingSegs.endTime
    }
  };
  checkForFailure(doesNewSegOverlapExistingSegs, segOverlapMsg, segOverlapProblemsObj, 422);
}