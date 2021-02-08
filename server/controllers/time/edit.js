const { checkForFailure, findItemWithId } = require('../utilities');
const { segments: segmentsCtrl } = require('../timePieces');
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

  let segment, jobId, updatedSegments = [];

  return new Promise((resolve, reject) => {
    ensureSegmentIsValid(newTimes);
    if (fragments) {
      const allFreshSegParts = newTimes ? [newTimes, ...fragments] : fragments;
      const hasOverlap = segmentsCtrl.doSegsOverlap(allFreshSegParts);
      checkForFailure(hasOverlap, 'Overlapping fragments.', { fragments: true }, 422);
    }
    WeekCtrl.getById(weekId, userId)
    .then(weekDoc => {
      if (!weekDoc) throw new Error('Week not found.');
      jobId = weekDoc.job;
      const day = findItemWithId(dayId, weekDoc.days, 'Day');
      segment = findItemWithId(segId, day.segments, 'Segment', !newTimes);
      _markSegModified();
      if (newTimes) {
        copySegProps(newTimes, ['startTime', 'endTime'], segment);
        ensureSegmentIsInDay(segment, day, 'updatedSegment');
        ensureNewSegDoesntOverlap(segment, day); // (also works for edit as well as new)
        _addMainUpdatedSegToResult();
      }
      return weekDoc.save();
    })
    .then(fragments ? _addFragmentsAndReturnJob : _getJob)
    .then(job => resolve({ job, updatedSegments }));
  });

  function _markSegModified() {
    segment.modified.push({
      time: Date.now(),
      previousValue: copySegProps(segment, ['startTime', 'endTime']),
      method: `edit segment${(fragments && fragments.length > 0) ? ' split' : ''}`
    });
  }
  function _addFragmentsAndReturnJob() {
    fragments.forEach(_addCreatedAndModdedToFrag);
    return addMultipleSegments(fragments, jobId, userId)
    .then(({ newSegmentsInfo, job }) => {
      updatedSegments.push(...newSegmentsInfo);
      return job;
    });
  }
  function _addCreatedAndModdedToFrag(_frag) {
    copySegProps(segment, ['created', 'modified'], _frag);
  }
  function _getJob() {
    return JobCtrl.getJobById(jobId, userId);
  }
  function _addMainUpdatedSegToResult() {
    updatedSegments.push({
      dayId, weekId, ...copySegProps(segment, ['startTime', 'endTime', 'created', 'modified'])
    });
  }
}


function copySegProps(originSeg, propsToCopyNames = [], target = {}) {
  propsToCopyNames.forEach(propName => {
    target[propName] = _copyProp(propName);
  });
  return target;
  
  function _copyProp(_propName) {
    const originVal = originSeg[_propName];
    switch (_propName) {
      case 'created':
        return copySegProps(originVal, ['time', 'method']);
      case 'modified':
        return originVal && originVal.map(_copyModsEntry);
      default:
        return originVal;
    }
  }
  function _copyModsEntry(_modInfo) {
    return {
      ...copySegProps(_modInfo, ['time', 'method']),
      previousValue: copySegProps(_modInfo.previousValue, ['startTime', 'endTime'])
    };
  }
}
