const router = require('express').Router();

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

const JobController = require('../../controllers/Job');
const UserController = require('../../controllers/User');

const { routeErrorHandlerFactory } = require('./utilities');

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
    .then(() => JobController.create(req.body))
    .then(({ _id }) => UserController.addJob(_id, userId))
    .then(({ jobs }) => res.json({ jobs: cleanJobs(jobs) }))
    .catch(routeErrorHandlerFactory(res));
  }
);

module.exports = router;

function cleanJobs(jobs) {
  return jobs.map(job => {
    const { name, timezone, wage, dayCutoff, weekBegins, startDate } = job;
    return { name, timezone, wage, dayCutoff, weekBegins, startDate };
  })
}