const router = require('express').Router();

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

const JobController = require('../../../controllers/Job');
const UserController = require('../../../controllers/User');

const { routeErrorHandlerFactory } = require('../utilities');

router.post(
  '/create',
  verifyLogin,
  (req, res) => {
    const { user, body } = req;
    const { name, timezone, startDate } = body;
    let problems = {};
    let problemMessages = [];
    if (!name) {
      problemMessages.push('You must give this job a unique name.');
      problems.name = true;
    }
    if (!timezone) {
      problemMessages.push('You must select a timezone to use for this job.');
      problems.timezone = true;
    }
    if (!startDate) {
      problemMessages.push('You must enter a start date for this job.');
      problems.startDate = true;
    }
    if (problemMessages.length) {
      return res.status(400).json({
        message: problemMessages.join(' '),
        problems
      });
    }
    // console.log(user)
    const userId = user._id;
    UserController.checkForJobWithName(name, userId)
    .then(() => JobController.create(body, userId))
    .then(({ _id }) => UserController.addJob(_id, userId))
    // .then()
    .then(({ jobs }) => res.json({ jobs }))
    .catch(routeErrorHandlerFactory(res));
  }
);

router.get(
  '/:_id',
  verifyLogin,
  (req, res) => {
    const { _id } = req.params;
    JobController.getJobById(req.params._id, req.user._id)
    .then(job => res.json(cleanJob(job)))
    .catch(routeErrorHandlerFactory(res));
  }
);

module.exports = router;

function cleanJobs(jobs) {
  return jobs.map(cleanJob);
}

function cleanJob(job) {
  let { name, timezone, wage, dayCutoff, weekBegins, startDate, weeks } = job;
  // weeks = cleanWeeks(weeks);
  return { name, timezone, wage, dayCutoff, weekBegins, startDate, weeks };
}

// Probably don't need to clean weeks & days; _ids are necessary for some things. Maybe look at removing unused props, but it's not necessary.
function cleanWeeks(weeks) {
  let cleanedWeeks = [];
  weeks.forEach(week => {
    console.log('af wef awfawef')
    let { days, firstDate, lastDate, weekNumber } = week.data.document.data;
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