const weeksController = require('../../../time/weeks');

const { getFirstDayOfWeekForDate, getUtcDateTime, areDatesEquivalent } = require('../utilities');

module.exports = {
  updateWeekBeginsForWeeks
};

function updateWeekBeginsForWeeks(job, allAffectedTimespans) {
  const weekBeginsSchedule = job.weekBegins;
  let modifiedWeekDocIds = [];
  let orphanedDays = [];
  job.weeks.forEach(week => {
    if (weeksController.isWeekInDateRanges(allAffectedTimespans, week)) {
      modifiedWeekDocIds.push(week.document._id.toString());
      removeAnyExtraDaysFromWeekDoc(week.document, weekBeginsSchedule, orphanedDays);
    }
  });
  // place orphaned days w/ weeks
    // for each orphaned day:
      // get 1st day of week for day
      // search weeks array for week whose first day matches day from previous step
        // (needs to be done by getting first day of week for one of the days, not by checking the first day.)
      // if not found, create weeks array entry for day date
      // add day to week. (check for day w/ date and replace when the week is newly created)
      // sort days array for adoptive week
  const orphanedDaysGroupedByWeek = groupDaysByWeek(orphanedDays, weekBeginsSchedule);
  let stillOrphanedDayGroups = [];
  placeDaysWithExistingWeeks(orphanedDaysGroupedByWeek, job, stillOrphanedDayGroups, modifiedWeekDocIds);
  let newWeeks;
  placeRemainingDaysWithNewWeeks(stillOrphanedDayGroups, job)
  .then(() => {

  })
  .catch(reject);
  // check if any weeks are missing days and add new days if they are
  // set firstDateUtcTime and lastDateUtcTime in array entry
  // save modified weeks
  // ???
  // profit
}

function placeRemainingDaysWithNewWeeks(daysGroupedByWeek, job) {
  return new Promise((resolve, reject) => {
    let newWeeks = [];
    let numCompleted = 0;
    daysGroupedByWeek.forEach(group => {
      const groupDayDateTimes = group.days.map(_day => getUtcDateTime(_day.date));
      weeksController.createWeekArrayEntryByDate(group.weekFirstDayDate)
      .then(week => {
        const weekDoc = week.document;
        weekDoc.days = weekDoc.days.filter(
          day => groupDayDateTimes.indexOf(getUtcDateTime(day.date)) === -1
        );
        weekDoc.days.push(...group.days);
        weekDoc.days.sort(day_1, day_2 => getUtcDateTime(day_1.date) - getUtcDateTime(day_2.date));
      });
    });
  });
}

function removeAnyExtraDaysFromWeekDoc(weekDoc, weekBeginsSchedule, orphanedDays) {
  const { days } = weekDoc;
  if (doFirstAndLastDaysGoTogether(days, weekBeginsSchedule)) {
    return;
  }
  // if not, then:
    // 1.) remove days from beginning of week until a day is reached that is the first day of its week
    // 2.) then keep all days for which the first day of week matches first day of week discovered in step #1.
    // 3.) remove all days that do not meet condition from step #2.
  let firstDayOfWeek;
  weekDoc.days = days.filter(day => {
    const firstDayOfWeekWithDay = getFirstDayOfWeekForDate(day.date, weekBeginsSchedule);
    if (areDatesEquivalent(day.date, firstDayOfWeekWithDay) && !firstDayOfWeek) {
      firstDayOfWeek = firstDayOfWeekWithDay;
      return true;
    }
    if (!firstDayOfWeek || !areDatesEquivalent(firstDayOfWeekWithDay, firstDayOfWeek)) {
      orphanedDays.push(day);
      return false;
    }
    return true;
  });
}

function placeDaysWithExistingWeeks(daysGroupedByWeek, job, unplacedGroups, modifiedWeekDocIds) {
  daysGroupedByWeek.forEach(group => {
    const { weekFirstDayDate, days } = group;
    const weekDoc = findWeekDocWithFirstDayDate(weekFirstDayDate, job.weeks, job.weekBegins);
    if (weekDoc) {
      weekDoc.days.push(...days);
      weekDoc.days.sort(day_1, day_2 => getUtcDateTime(day_1.date) - getUtcDateTime(day_2.date));
      modifiedWeekDocIds.push(weekDoc._id.toString());
    }
    else {
      unplacedGroups.push(group);
    }
  });
}

function findWeekDocWithFirstDayDate(date, weeks, weekBeginsSchedule) {
  for (let i = 0; i < weeks.length; i++) {
    const firstDayOfWeekDate = getFirstDayOfWeekForDate(weeks[i].days[0], weekBeginsSchedule);
    if (areDatesEquivalent(date, firstDayOfWeekDate)) return weeks[i].document;
  }
}

function doFirstAndLastDaysGoTogether(days, weekBeginsSchedule) {
  // only checks that first and last days are correct
  const firstDayDate = days[0].date;
  const lastDayDate = days[days.length - 1].date;
  const firstDayOfWeekWithLastDayDate = getFirstDayOfWeekForDate(lastDayDate, weekBeginsSchedule)
  return areDatesEquivalent(firstDayDate, firstDayOfWeekWithLastDayDate);
}

function groupDaysByWeek(days, weekBeginsSchedule) {
  let daysGroupedByWeek = [];
  days.forEach(day => {
    const firstDayOfWeekWithDayDate = getFirstDayOfWeekForDate(day.date, weekBeginsSchedule);
    const daysGroupIndex = _findIndexOfGroupForWeekFirstDayDate(firstDayOfWeekWithDayDate);
    if (daysGroupIndex !== -1) {
      daysGroupedByWeek[daysGroupIndex].days.push(day);
    }
    else {
      daysGroupedByWeek.push({
        weekFirstDayDate: firstDayOfWeekWithDayDate,
        days: [day]
      });
    }
  });
  function _findIndexOfGroupForWeekFirstDayDate(date) {
    for (let i = 0; i < daysGroupedByWeek.length; i++) {
      if (areDatesEquivalent(date, daysGroupedByWeek[i].weekFirstDayDate)) {
        return i;
      }
    }
    return -1;
  }
}