const Day = require('../models/DayData');

const { convertMomentToMyDate, getFirstDayOfWeekForDate, getMoment } = require('../utilities');

module.exports = {
  create: newDay => new Promise(
    (resolve, reject) => {
      const { date, startCutoff, endCutoff, segments, timezone, job } = newDay;
      if (!segments) newDay.segments = [];
      // console.log(newDay)
      if (!date || (!startCutoff && startCutoff !== 0) || (!endCutoff && startCutoff !== 0) || !timezone || !job) {
        const error = new Error('Missing required data properties.');
        reject(error);
        throw(error);
      }
      // console.log('$ $$ '.repeat(20));
      // console.log(newDay)
      Day.create(newDay)
      .then(result => {
        // console.log('new day created\n----------------------------------------')
        return resolve(result);
      })
      .catch(err => reject(determineCreateDayError(err)));
    }
  )
};

function determineCreateDayError(err) {
  if (!err) err = {};
  const { errors } = err;

  let problems = {};
  let messages = [];

  if (!errors) {
    return {
      messages: [err.message || 'Unknown error creating day.']
    };
  }
  if (errors.date) {
    problems.date = true;
    messages.push('Invalid date.');
  }
  if (errors.startCutoff) {
    problems.startCutoff = true;
    messages.push('Invalid startCutoff.');
  }
  if (errors.endCutoff) {
    problems.endCutoff = true;
    messages.push('Invalid endCutoff.');
  }
  if (errors.segments) {
    problems.segments = true;
    messages.push('Invalid segments.');
  }
  if (errors.timezone) {
    problems.timezone = true;
    messages.push('Invalid timezone.');
  }
  if (errors.wage) {
    problems.wage = true;
    messages.push('Invalid wage.');
  }
  if (errors.job) {
    problems.job = true;
    messages.push('Invalid job.');
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