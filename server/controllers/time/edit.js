const {
  checkForFailure,
  findItemWithId
} = require('../utilities');
const {
  segments: segmentsCtrl,
  days: daysCtrl
} = require('../timePieces');
const WeekCtrl = require('../Week');
const JobCtrl = require('../Job');
const {
  ensureNewSegDoesntOverlap, ensureSegmentIsInDay, ensureSegmentIsValid
} = require('./elemental');
const { addMultipleSegments } = require('./add');

module.exports = {
  editSegment
};


function editSegment(segId, weekId, dayId, userId, newTimes, fragments, jobId) {
  return new Promise((resolve, reject) => {
    ensureSegmentIsValid(newTimes);
    if (fragments) {
      const hasOverlap = segmentsCtrl.doSegsOverlap([newTimes, ...fragments]);
      checkForFailure(hasOverlap, 'Overlapping fragments.', { fragments: true }, 422);
    }
    let segment;
    WeekCtrl.getById(weekId, userId)
    .then(weekDoc => {
      const day = findItemWithId(dayId, weekDoc.days, 'Day');
      const segment = findItemWithId(segId, day.segments, 'Segment');
      ensureSegmentIsInDay(segment, day, 'updatedSegment');
      // segment = findSegInWeek(weekDoc, segId, dayId);
      segment.modified.push({
        time: Date.now(),
        previousValue: {
          startTime: segment.startTime,
          endTime: segment.endTime
        },
        method: 'edit segment'
      });
      segment.startTime = newTimes.startTime;
      segment.endTime = newTimes.endTime;
      ensureNewSegDoesntOverlap(segment, day)

      console.log('created\n', segment.created);
      console.log({ ...segment.created });
      console.log('modified\n', modified)
      console.log(modified.map(info => ({ ...info })));

      return weekDoc.save();
    })
    .then(
      fragments ?
      _addFragmentsAndFormatResult :
      _getJobAndFormatResults
    )
    .then(resolve);

    function _addFragmentsAndFormatResult() {
      const mainSegArr = segment ? [segment] : [];
      return addMultipleSegments(fragments, jobId, userId)
      .then(({ newSegmentsInfo, ...other }) => ({
        updatedSegments: [ ...mainSegArr, ...newSegmentsInfo ],
        ...other
      }));
    }

    function _getJobAndFormatResults() {
      return JobCtrl.getJobById(jobId, userId)
      .then(job => ({
        job,
        updatedSegments: [ segment ]
      }));
    }
  });
}
