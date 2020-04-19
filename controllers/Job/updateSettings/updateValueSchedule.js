const { Job, } = require('../../../models');

const { getUtcMoment } = require('../utilities');

module.exports = updateValueSchedule;

function updateValueSchedule(updates, job, propName) {
  // need to return job w/ updated value schedule
  const jobId = job._id;
  return executeRemoveUpdates(updates.remove, jobId, propName)
  .then(() => executeChangeDateUpdates(updates.changeDate, jobId, propName))
  .then(() => executeEditUpdates(updates.edit, jobId, propName))
  .then(() => executeAddUpdates(updates.add, jobId, propName))
  .then(() => job);
}

function executeRemoveUpdates(removalUpdates, job, propName) {
  return new Promise((resolve, reject) => {
    if (removalUpdates.length === 0) return resolve();
    Job.findByIdAndUpdate(
      job._id,
      {
        $pull: {
          [propName]: {
            _id: {
              $in: removalUpdates.map(update => update.id)
            }
          }
        }
      },
      { new: true }
    )
    .then(_job => {
      job[propName] = _job[propName];
      resolve();
    });
  });
}

function executeChangeDateUpdates(dateChangeUpdates, job, propName) {
  // still need to ensure updated schedule is in chronological order. If 2 or more date changes result in dates being crossed, schedule must be rearranged.
  return new Promise((resolve, reject) => {
    if (dateChangeUpdates.length === 0) return resolve();
    const idPropName = propName + '._id';
    const dateFieldName = propName + '.$.startDate';
    const dateTimeFieldName = propName + '.$.startDateUtcTime';
    let numCompleted = 0;
    for (let i = 0; i < dateChangeUpdates.length; i++) {
      const { id, startDate } = dateChangeUpdates[i];
      const startDateUtcTime = getUtcMoment(startDate).valueOf();
      Job.findOneAndUpdate(
        {
          _id: job._id,
          [idPropName]: id
        },
        {
          $set: {
            [dateFieldName]: startDate,
            [dateTimeFieldName]: startDateUtcTime
          }
        },
        { new: true }
      )
      .then(() => {
        if (++numCompleted === dateChangeUpdates.length) {
          Job.findOneAndUpdate(
            { _id: job._id },
            {
              $push: {
                [propName]: {
                  $each: [],
                  $sort: { startDateUtcTime: 1 }
                }
              }
            },
            { new: true }
          )
          .then(_job => {
            job[propName] = _job[propName];
            resolve();
          });
        }
      });
    }
  });
}

function executeEditUpdates(editingUpdates, job, propName) {
  return new Promise((resolve, reject) => {
    if (editingUpdates.length === 0) return resolve();
    const idPropName = propName + '._id';
    const fieldName = propName + '.$.value';
    let numCompleted = 0;
    for (let i = 0; i < editingUpdates.length; i++) {
      const { id, value } = editingUpdates[i];
      Job.findOneAndUpdate(
        {
          _id: job._id,
          [idPropName]: id
        },
        {
          $set: {
            [fieldName]: value
          }
        },
        { new: true }
      )
      .then(_job => {
        if (++numCompleted === editingUpdates.length) {
          job[propName] = _job[propName];
          resolve();
        }
      });
    }
  });
}

function executeAddUpdates(additionUpdates, job, propName) {
  return new Promise((resolve, reject) => {
    if (additionUpdates.length === 0) return resolve();
    additionUpdates = additionUpdates.map(
      ({ startDate, value }) => ({
        startDate,
        value,  
        startDateUtcTime: getUtcMoment(startDate).valueOf()
      })
    );
    Job.findByIdAndUpdate(
      job._id,
      {
        $push: {
          [propName] : {
            $each: additionUpdates,
            $sort: { startDateUtcTime: 1 }
          }
        }
      },
      { new: true }
    )
    .then(_job => {
      job[propName] = _job[propName];
      resolve();
    });
  });
}