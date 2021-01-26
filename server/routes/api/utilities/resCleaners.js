module.exports = {
  cleanUser,
  cleanJob,
  cleanJobsExtra,
  cleanWeeks,
  // cleanWeek,
  cleanWeekDoc
};

function cleanUser(user) {
  const { username, email, jobs, _id } = user;
  return {
    username,
    email,
    jobs: cleanJobsExtra(jobs),
    timeCreated: _id.getTimestamp().getTime()
  };
}

function cleanJobs(jobs) {
  return jobs.map(cleanJob);
}

function cleanJob(job) {
  let cleanedJob = { weeks: cleanWeeks(job.weeks) };
  const propsToKeep = ['_id', 'name', 'timezone', 'wage', 'dayCutoff', 'weekBegins', 'startDate'];
  propsToKeep.forEach(propName => cleanedJob[propName] = job[propName]);
  return cleanedJob;
}

function cleanJobsExtra(jobs) {
  return jobs.map(cleanJobExtra);
}

function cleanJobExtra(job) {
  let { name, startDate, _id } = job;
  return { name, startDate, _id };
}

function cleanWeeks(weeks) {
  return weeks.map(({ document }) => cleanWeekDoc(document));
}

// function cleanWeek(rawWkArrayEntry) { // also moves `document` props to top level
//   return cleanWeekDoc(rawWkArrayEntry.document);
// }

function cleanWeekDoc(rawWkDoc) {
  const propsToKeep = ['days', 'firstDate', 'lastDate', 'weekNumber', '_id'];
  let cleanedWk = {};
  propsToKeep.forEach(propName => cleanedWk[propName] = rawWkDoc[propName]);
  return cleanedWk;
}
