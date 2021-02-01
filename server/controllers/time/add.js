/*
ABOUT THIS FILE/FOLDER:
  These are the general methods invoked by the `/time/` api routes.
  This controller doesn't correspond to a specific model. The methods affect multiple models.
  This controller invokes other controllers rather than referencing the models directly.
*/

const WeekController = require('../Week');
const JobController = require('../Job');
const {
  segments: segmentsController,
  days: daysController,
  weeks: weeksController
} = require('../timePieces');

const { checkForFailure, findItemWithId } = require('../utilities');

module.exports = {
  addSegmentToDay,
  addSegment,
  addMultipleSegments,
};

function addSegmentToDay(segment, dayId, weekId, userId) {
  return new Promise(
    (resolve, reject) => {
      ensureSegmentIsValid(segment);
      segment.created = {
        method: 'specific-day',
        time: Date.now()
      };
      WeekController.getById(weekId, userId)
      .then(weekDoc => ensureSegmentCanBeAddedToDay(segment, dayId, weekDoc))
      .then(() => WeekController.addSegmentToDay(segment, dayId, weekId, userId))
      .then(updatedWeekDoc => {
        resolve({
          weekDoc: updatedWeekDoc,
          newSegmentInfo: { created: segment.created }
        });
      })
      .catch(reject);
    }
  );
}

function addSegment(segment, jobId, userId) {
  return new Promise(
    (resolve, reject) => {
      ensureSegmentIsValid(segment);
      if (!segment.created) {
        segment.created = {
          method: 'general',
          time: Date.now()
        };
      }
      let date, weekDoc, job, dayId;
      JobController.getJobById(jobId, userId)
      .then(_job => {
        date = segmentsController.getDateForNewSegment(segment, _job);
        weekDoc = weeksController.findWeekWithDate(date, _job.weeks);
        return weekDoc ? _job : JobController.createAndAddWeekWithDate(date, _job);
      })
      .then(_job => {
        job = _job;
        if (!weekDoc) weekDoc = weeksController.findWeekWithDate(date, job.weeks);
        day = daysController.findDayForDate(date, weekDoc.days);
        ensureNewSegDoesntOverlap(segment, day);
        dayId = day._id;
        return WeekController.addSegmentToDay(segment, dayId, weekDoc._id, userId);
      })
      .then(updatedWeekDoc => {
        const weeks = job.weeks;
        for (let i = 0; i < weeks.length; i++) {
          let week = weeks[i];
          if (updatedWeekDoc._id.toString() === week.document._id.toString()) {
            week.document = updatedWeekDoc;
            return resolve({
              job,
              newSegmentInfo: {
                weekId: weekDoc._id,
                dayId,
                created: segment.created,
                startTime: segment.startTime,
                endTime: segment.endTime
              }
            });
          }
        }
        throw new Error('Unexpected error. Week document not found in weeks array for job.');
      })
      .catch(reject);
    }
  );
}

function addMultipleSegments(segments, jobId, userId) {
  return new Promise(resolve => {
    let index = 0;
    let newSegmentsInfo = [];
    let job;
    _addNextSeg()
    .catch(error => {
      if (newSegmentsInfo.length === 0) throw err;
      resolve({ job, newSegmentsInfo, error });
    });
  
    function _addNextSeg() {
      return addSegment(segments[index], jobId, userId)
      .then(({ job: _job, newSegmentInfo }) => {
        job = _job;
        newSegmentsInfo.push(newSegmentInfo);
        if (++index === segments.length) {
          return resolve({ job, newSegmentsInfo });
        }
        _addNextSeg();
      });
    }
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
  const day = findItemWithId(dayId, weekDoc.days);
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
