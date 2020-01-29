const Week = require('../models/Week');

const { getUtcMoment } = require('../utilities');

module.exports = {
  create: (newWeek, jobId, userId) => new Promise(
    (resolve, reject) => {
      const {
        days, firstDate, lastDate, weekNumber, timezone, wage, dayCutoff
      } = newWeek;
      if (
        !days || !firstDate || !lastDate || (!weekNumber && weekNumber !== 0) || !timezone || !wage || (!dayCutoff && dayCutoff !== 0)
      ) {
        const err = new Error('Missing required data properties.');
        reject(err);
        throw(err);
      }
      newWeek.firstDateUtcTime = getUtcMoment(firstDate).valueOf();
      newWeek.lastDateUtcTime = getUtcMoment(lastDate).valueOf();
      Week.create({
        data: newWeek,
        job: jobId,
        user: userId
      })
      .then(resolve)
      .catch(err => reject(determineCreateWeekError(err)));
    }
  )
}

function determineCreateWeekError(err) {
  return err;
}