const { Job, } = require('../../../models');

const { getUtcDateTime } = require('../utilities');

module.exports = updateValueSchedule;

function updateValueSchedule(updates, job, propName) {
  console.log('\n@-@-@ UPDATE VALUE SCHEDULE ~_~^~_~^~_~')
  // need to return job w/ updated value schedule
  return executeRemoveUpdates(updates.remove, job, propName)
  .then(() => executeOtherUpdates(updates, job, propName))
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
    })
    .catch(reject);
  });
}

function executeOtherUpdates(updates, job, propName) {
  return new Promise((resolve, reject) => {
    performChangeDateUpdates(updates.changeDate, job, propName);
    performEditUpdates(updates.edit, job, propName);
    performAddUpdates(updates.add, job, propName);
    job.save()
    .then(_job => {
      job[propName] = _job[propName];
      resolve();
    })
    .catch(reject);
  });
}

function performEditUpdates(editingUpdates, job, propName) {
  // return new Promise((resolve, reject) => {
    if (editingUpdates.length === 0) return resolve();
    for (let i = 0; i < editingUpdates.length; i++) {
      updateValueScheduleEntry(editingUpdates[i].id, job[propName], editingUpdates[i].value);
    }
    // const idPropName = propName + '._id';
    // const fieldName = propName + '.$.value';
    // let numCompleted = 0;
    // for (let i = 0; i < editingUpdates.length; i++) {
    //   const { id, value } = editingUpdates[i];
    //   Job.findOneAndUpdate(
    //     {
    //       _id: job._id,
    //       [idPropName]: id
    //     },
    //     {
    //       $set: {
    //         [fieldName]: value
    //       }
    //     },
    //     { new: true }
    //   )
    //   .then(_job => {
    //     if (++numCompleted === editingUpdates.length) {
    //       job[propName] = _job[propName];
    //       resolve();
    //     }
    //   })
    //   .catch(reject);
    // }
  // });
}

function updateValueScheduleEntry(entryId, schedule, newValue) {
  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i]._id.toString() === entryId.toString()) {
      schedule[i].value = newValue;
      return;
    }
  }
  throw new Error('Failed to update value schedule entry');
}

function performAddUpdates(additionUpdates, job, propName) {
  // return new Promise((resolve, reject) => {
    if (additionUpdates.length === 0) return;
    additionUpdates = additionUpdates.map(
      ({ startDate, value }) => ({
        startDate,
        value,  
        startDateUtcTime: getUtcDateTime(startDate)
      })
    );
    // console.log('==================================')
    // console.log(job)
    // console.log('\n' + propName)
    additionUpdates.forEach(el => {
      job[propName].push(el);
    });
    // job[propName].push({ $each: additionUpdates });
    job[propName].sort(
      (el_1, el_2) => {
        const dateTime_1 = el_1.startDateUtcTime;
        const dateTime_2 = el_2.startDateUtcTime;
        if (!dateTime_1) return -1;
        if (!dateTime_2) return 1;
        return dateTime_1 - dateTime_2;
      }
    );
    job.save()
    .then(_job => {
      job[propName] = _job[propName];
      resolve();
    })
    .catch(reject);
  // });
}

function performChangeDateUpdates(dateChangeUpdates, job, propName) {
  // still need to ensure updated schedule is in chronological order. If 2 or more date changes result in dates being crossed, schedule must be rearranged.
  // return new Promise((resolve, reject) => {
    if (dateChangeUpdates.length === 0) return;
    const idPropName = propName + '._id';
    const dateFieldName = propName + '.$.startDate';
    const dateTimeFieldName = propName + '.$.startDateUtcTime';
    let numCompleted = 0;
    for (let i = 0; i < dateChangeUpdates.length; i++) {
      const { id, startDate } = dateChangeUpdates[i];
      const startDateUtcTime = getUtcDateTime(startDate);

      // Job.findOneAndUpdate(
      //   {
      //     _id: job._id,
      //     [idPropName]: id
      //   },
      //   {
      //     $set: {
      //       [dateFieldName]: startDate,
      //       [dateTimeFieldName]: startDateUtcTime
      //     }
      //   },
      //   { new: true }
      // )
      // .then(() => {
      //   if (++numCompleted === dateChangeUpdates.length) {
      //     Job.findOneAndUpdate(
      //       { _id: job._id },
      //       {
      //         $push: {
      //           [propName]: {
      //             $each: [],
      //             $sort: { startDateUtcTime: 1 }
      //           }
      //         }
      //       },
      //       { new: true }
      //     )
      //     .then(_job => {
      //       job[propName] = _job[propName];
      //       resolve();
      //     })
      //     .catch(reject);
      //   }
      // })
      // .catch(reject);
    }
  // });
}