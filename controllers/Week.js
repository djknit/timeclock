const mongoose = require('mongoose');

const Week = require('../models/Week');
const Job = require('../models/Job');

const { getUtcDateTime } = require('../utilities');

module.exports = {
  create,
  getById,
  addSegmentToDay,
  removeSegment,
  removeAllSegments,
  removeSegmentsFromDaysWithIds,
  deleteWeeks,
  updateJobSettingsForDays
}

function create(newWeek, jobId, userId) {
  return new Promise((resolve, reject) => {
    const { days, firstDate, lastDate, weekNumber } = newWeek;
    if (!days || !firstDate || !lastDate || (!weekNumber && weekNumber !== 0)) {
      const err = new Error('Missing required data properties.');
      reject(err);
      throw(err);
    }
    Week.create({
      days,
      firstDate,
      lastDate,
      weekNumber,
      job: jobId,
      user: userId
    })
    .then(resolve)
    .catch(err => reject(determineCreateWeekError(err)));
  });
}

function getById(weekId, userId) {
  return Week.findOne({
    _id: weekId,
    user: userId
  });
}

function addSegmentToDay(segment, dayId, weekId, userId) {
  return new Promise((resolve, reject) => {
    Week.findOneAndUpdate(
      {
        _id: weekId,
        user: userId,
        'days._id': dayId
      },
      {
        $push: {
          'days.$.segments': {
            $each: [segment],
            $sort: { startTime: 1 }
          }
        }
      },
      { new: true }
    )
    .then(resolve)
    .catch(err => reject(determineAddSegmentToDayError(err)));
  });
}

function removeSegment(segmentId, dayId, weekId, userId) {
  return new Promise((resolve, reject) => {
    Week.findOneAndUpdate(
      {
        _id: weekId,
        user: userId,
        'days._id': dayId
      },
      {
        $pull: {
          'days.$.segments': {
            _id: segmentId
          }
        }
      },
      { new: true }
    )
    .then(resolve)
    .catch(err => reject(determineAddSegmentToDayError(err)));
  });
}

function removeAllSegments(weekId, userId) {
  return new Promise((resolve, reject) => {
    Week.findOneAndUpdate(
      {
        _id: weekId,
        user: userId,
      },
      {
        $set: {
          'days.$[].segments': []
        }
      },
      { new: true }
    )
    .then(resolve)
    .catch(reject);
  });
}

function removeSegmentsFromDaysWithIds(dateIds, weekId, userId) {
  return new Promise((resolve, reject) => {
    dateIds.forEach((id, index) => {
      if (typeof(id) === 'string') {
        dateIds[index] = mongoose.Types.ObjectId(id);
      }
    });
    // source: https://jira.mongodb.org/browse/SERVER-1243
    Week.findOneAndUpdate(
      {
        _id: weekId,
        user: userId
      },
      {
        $set: {
          'days.$[i].segments': []
        }
      },
      {
        arrayFilters: [{
          $or: dateIds.map(id => ({ 'i._id': id }))
        }],
        new: true
      }
    )
    .then(resolve)
    .catch(reject);
  });
}

function updateJobSettingsForDays(dayIdsAndUpdatedProps, weekId) {
  return new Promise((resolve, reject) => {
    console.log('\n', dayIdsAndUpdatedProps, '\n')
    console.log('WEEK ID')
    console.log(weekId)
    console.log('WEEK ID')
    let numCompleted = 0;
    for (let i = 0; i < dayIdsAndUpdatedProps.length; i++) {
      const { id, updates } = dayIdsAndUpdatedProps[i];
      console.log('\n -+-+-+-+-+ + _ _ _  _ _  _')
      console.log(updates)
      console.log(id)
      Week.findOneAndUpdate(
        {
          _id: weekId,
          'days._id': id
        },
        { $set: updates },
        { new: true }
      )
      .then(weekDoc => {
        console.log(weekDoc)
        if (!weekDoc) throw new Error('Failed to find and update weekId="' + weekId + '" dayId="' + id + '".');
        if (++numCompleted === dayIdsAndUpdatedProps.length) {
          return resolve(weekDoc);
        }
      });
    }
  });
}

function deleteWeeks(weekIds, userId) {
  return new Promise((resolve, reject) => {
    Week.deleteMany({
      _id: { $in: weekIds },
      user: userId
    })
    .then(resolve)
    .catch(reject);
  });
}

function determineCreateWeekError(err) {
  return err;
}

function determineAddSegmentToDayError(err) {
  return err; 
;}