module.exports = {
  cleanUser,
  cleanJob,
  cleanJobsExtra,
  cleanWeeks,
  cleanDays,
  cleanSegments
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
  let { _id, name, timezone, wage, dayCutoff, weekBegins, startDate, weeks } = job;
  // weeks = cleanWeeks(weeks);
  return { _id, name, timezone, wage, dayCutoff, weekBegins, startDate, weeks };
}

function cleanJobsExtra(jobs) {
  return jobs.map(cleanJobExtra);
}

function cleanJobExtra(job) {
  let { name, startDate, _id } = job;
  return { name, startDate, _id };
}

// Probably don't need to clean weeks & days; _ids are necessary for some things. Maybe look at removing unused props, but it's not necessary.
function cleanWeeks(weeks) {
  let cleanedWeeks = [];
  weeks.forEach(week => {
    let { days, firstDate, lastDate, weekNumber } = week.document.data;
    days = cleanDays(days);
    cleanedWeeks.push({ days, firstDate, lastDate, weekNumber });
  });
  return cleanedWeeks;
}

function cleanDays(days) {
  let cleanedDays = [];
  days.forEach(day => {
    let { date, startCutoff, endCutoff, segments, timezone, wage } = day;
    segments = cleanSegments(segments);
    cleanedDays.push({ date, startCutoff, endCutoff, segments, timezone, wage });
  });
  return cleanedDays;
}

function cleanSegments(segments) {
  let cleanedSegments = [];
  segments.forEach(segment => {
    const { startTime, endTime } = segment;
    cleanedSegments.push({ startTime, endTime });
  });
  return cleanedSegments;
}