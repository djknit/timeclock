const Job = require('../models/Job');

const moment = require('moment-timezone');

const WeekController = require('./Week');
const UserController = require('./User');
const weeksController = require('./time/weeks');


const { convertMomentToMyDate, getFirstDayOfWeekForDate, getMoment } = require('../utilities');

module.exports = {
  create: (newJob, userId) => new Promise(
    (resolve, reject) => {
      const { name, timezone, wage, startDate, dayCutoff, weekBegins } = newJob;
      console.log('- - - CREATE JOB - - -')
      if (!name || !timezone || !startDate) {
        const error = new Error('Missing required data properties.');
        reject(error);
        throw(error);
      }
      newJob.user = userId;
      newJob.timezone = [{ value: timezone }];
      newJob.dayCutoff = 
        dayCutoff ?
        [{ value: dayCutoff }] :
        [{}];
      newJob.weekBegins = 
        weekBegins ?
        [{ value: weekBegins }] :
        [{}];
      newJob.effectiveStartDate = getEffectiveStartDate(startDate, weekBegins || 0);
      if (wage) {
        newJob.wage = [{ value: wage }];
      }
      else newJob.wage = [{ value: null }];
      let jobId;
      Job.create(newJob)
      .then(result => {
        console.log('new job -------------')
        // console.log('new job created\n----------------------------------------')
        jobId = result._id;
        return weeksController.createWeekArrayEntryByDate(result.startDate, result);
      })
      .then(firstWeek => addWeek(firstWeek, jobId))
      .then(job => resolve(job))
      .catch(err => reject(determineCreateJobError(err)));
    }
  ),
  addWeek,
  getJobById,
  getWeekWithDate,
  deleteJob
};

function getJobById(jobId, userId) {
  return Job.findOne({ _id: jobId, user: userId })
  .populate('weeks.data.document');
}

function getJobBasicsById(jobId, userId) {
  return Job.findOne({ _id: jobId, user: userId });
}

function getEffectiveStartDate(startDate, weekBegins) {
  let firstDateOfFirstWeekEstimate = getMoment(startDate).day(weekBegins);
  if (firstDateOfFirstWeekEstimate.valueOf() > getMoment(startDate).valueOf()) {
    firstDateOfFirstWeekEstimate.subtract(1, 'weeks');
  }
  let resultEstimate = firstDateOfFirstWeekEstimate;
  if (Math.abs(resultEstimate.diff(getMoment(startDate), 'days')) > 3) {
    resultEstimate.add(1, 'weeks');
  }
  return convertMomentToMyDate(resultEstimate);
}

function addWeek(week, jobId) {
  return new Promise(
    (resolve, reject) => {
      // Job.findById(jobId).then(result=>console.log(result))
      console.log('adding week...')
      console.log(week);
      console.log('+ +  +   +    +     +      +')
      // console.log(jobId)
      Job.findByIdAndUpdate(
        jobId,
        {
          $push: {
            weeks: week
          }
        },
        { new: true }
      )
      .populate('weeks.data.document')
      .then(result => {console.log(result); resolve(result)})
      .catch(err => {
        // console.log(('=*'.repeat(30) + '\n').repeat(3));
        // console.error(err);
        // console.log('ADD WEEK ERROR');
        const reason = err && err.reason && err.reason.reason && err.reason.reason;
        // console.log(reason);
        reject(err);
      });
    }
  );
}

function getWeekWithDate(date, job) {
  return new Promise(
    (resolve, reject) => {
      const weekDoc = weeksController.findWeekWithDate(date, job.weeks);
      if (weekDoc) return resolve(weekDoc);
      else {
        weeksController.createWeekArrayEntryByDate(date, job)
        .then(weekArrayEntry => addWeek(weekArrayEntry, job._id))
        .then(result => resolve(weekArrayEntry.data.document))
        .catch(reject);
      }
    }
  );
}

function deleteJob(jobId, userId) {
  return new Promise(
    (resolve, reject) => {
      let userData;
      getJobBasicsById(jobId, userId)
      .then(job => {
        const weekIds = job.weeks.map(ArrayEntry => ArrayEntry.data.document);
        return WeekController.deleteWeeks(weekIds, userId);
      })
      .then(result => UserController.removeJob(jobId, userId))
      .then(updatedUserData => {
        userData = updatedUserData;
        return Job.deleteOne({
          _id: jobId,
          user: user._id
        });
      })
      .then(result => resolve(userData))
      .catch(reject);
    }
  );
}

function determineCreateJobError(err) {
  if (!err) err = {};
  const { errors } = err;

  let problems = {};
  let messages = [];

  if (!errors) {
    return {
      messages: [err.message || 'Unknown error creating job.']
    };
  }
  if (errors.startDate) {
    problems.startDate = true;
    messages.push('Invalid start date.');
  }
  if (errors['timezone.0.value']) {
    problems.timezone = true;
    messages.push('Invalid timezone.');
  }
  const weekBeginsError = errors['weekBegins.0.value'];
  if (weekBeginsError) {
    problems.weekBegins = true;
    messages.push(weekBeginsError.message);
  }
  const dayCutoffError = errors['dayCutoff.0.value']
  if (dayCutoffError) {
    problems.dayCutoff = true;
    messages.push(dayCutoffError.message);
  }
  const wageError = errors['wage.0.value'];
  if (wageError) problems.wage = {};
  if (wageError && wageError.kind === 'user defined') {
    determineUserDefinedWageError(wageError, problems.wage, messages);
  }
  const rateError = errors['wage.0.value.rate'];
  if (rateError) {
    problems.wage.rate = true;
    messages.push(
      (rateError.kind === 'required' && 'Invalid wage. Wage object must include pay rate.') ||
      (rateError.name === 'CastError' && 'Invalid pay rate; not a number.') ||
      rateError.message
    );
  }
  const overtimeError = errors['wage.0.value.overtime'];
  if (overtimeError) {
    problems.wage.overtime = problems.wage.overtime || {};
  }
  if (overtimeError && overtimeError.kind === 'user defined') {
    problems.wage.overtime.rate = true;
    problems.wage.overtime.useMultiplier = true;
    messages.push(overtimeError.message);
  }
  if (errors['wage.0.value.overtime.rate']) {
    problems.wage.overtime.rate = true;
    messages.push('Invalid overtime wage.');
  }
  if (errors['wage.0.value.overtime.useMultiplier']) {
    problems.wage.overtime.useMultiplier = true;
    messages.push('Invalid overtime; invalid `useMultiplier` value.');
  }
  const overtimeCutoffError = errors['wage.0.value.overtime.cutoff'];
  if (overtimeCutoffError) {
    problems.wage.overtime.cutoff = true;
    if (overtimeCutoffError.message.indexOf('integer') !== -1) {
      overtimeCutoffError.message = 'Invalid overtime cutoff. ' + overtimeCutoffError.message;
    }
    messages.push(
      overtimeCutoffError.kind === 'user defined' ?
        overtimeCutoffError.message :
        'Invalid overtime cutoff.'
    );
  }

  if (messages.length > 0) {
    return {
      problems,
      status: 422,
      messages,
      errors
    };
  }

  return err;
}

function determineUserDefinedWageError(wageError, wageProblems, messages) {
  const errorMessage = wageError.message || '';
  if (errorMessage.indexOf('currency') !== -1) {
    wageProblems.currency = true;
  }
  else if (errorMessage.indexOf('overtime') !== -1) {
    wageProblems.overtime = wageProblems.overtime || {};
    wageProblems.overtime.rate = true;
  }
  else {
    wageProblems.rate = true;
  }
  messages.push(errorMessage);
}