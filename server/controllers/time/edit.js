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


function editSegment(segId, weekId, dayId, userId, newTimes, fragments) {
  return new Promise((resolve, reject) => {
    ensureSegmentIsValid(newTimes);
    if (fragments) {
      const hasOverlap = segmentsCtrl.doSegsOverlap([newTimes, ...fragments]);
      checkForFailure(hasOverlap, 'Overlapping fragments.', { fragments: true }, 422);
    }
    let segment, jobId;
    WeekCtrl.getById(weekId, userId)
    .then(weekDoc => {
      if (!weekDoc) throw new Error('Week not found.');
      jobId = weekDoc.job;
      const day = findItemWithId(dayId, weekDoc.days, 'Day');
      segment = findItemWithId(segId, day.segments, 'Segment');
      ensureSegmentIsInDay(segment, day, 'updatedSegment');
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
      ensureNewSegDoesntOverlap(segment, day); // (also works for edit as well as new)
      __logDaSegment(segment);
      return weekDoc.save();
    })
    .then(fragments ? _addFragmentsAndFormatResults : _getJobAndFormatResults)
    .then(resolve);

    function _addFragmentsAndFormatResults() {
      fragments.forEach(_addCreatedAndModdedToFrag);
      const mainSegArr = segment ? [segment] : [];
      return addMultipleSegments(fragments, jobId, userId)
      .then(({ newSegmentsInfo, ...other }) => ({
        updatedSegments: [...mainSegArr, ...newSegmentsInfo],
        ...other
      }));
    }

    function _addCreatedAndModdedToFrag(_frag) {
      Object.assign(_frag, copyCreatedAndModded(segment));
    }

    function _getJobAndFormatResults() {
      return JobCtrl.getJobById(jobId, userId)
      .then(job => ({
        job,
        updatedSegments: [segment]
      }));
    }
  });
}


function copyCreatedAndModded({ created, modified }) {
  return {
    created: copyObjProps(created, ['time', 'method']),
    modified: modified && copyModified(modified)
  };
}

function copyModified(originalModified) {
  return originalModified.map(modInfo => ({
    ...copyObjProps(modInfo, ['time', 'method']),
    previousValue: copyObjProps(modInfo.previousValue, ['startTime', 'endTime'])
  }));
}

function copyObjProps(originalObj, propsToCopyNames) {
  if (!originalObj) return;
  let objCopy = {};
  propsToCopyNames.forEach(propName => objCopy[propName] = originalObj[propName]);
  return objCopy;
}


function __logDaSegment(segment) {
  console.log('created\n', segment.created);
  console.log({ ...segment.created });
  console.log('modified\n',segment.modified)
  console.log(segment.modified.map(info => ({ ...info })));
}