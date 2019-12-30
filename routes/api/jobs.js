const router = require('express').Router();

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

const JobController = require('../../controllers/Job');

const { routeErrorHandlerFactory } = require('./utilities');

router.post(
  '/create',
  verifyLogin,
  (req, res) => {
    const { name, timezone, startDate } = req.body;
    let problems = {};
    let problemMessages = [];
    if (!name) {
      problemMessages.push('You must give this job a unique name.');
      problems.name = true;
    }
    if (!timezone) {
      problemMessages.push('You must select a timezone to use for this job.');
      problems.name = true;
    }
    if (!startDate) {
      problemMessages.push('You must enter a start date for this job.');
      problems.name = true;
    }
    if (problemMessages.length) {
      res.status(400).json({
        message: problemMessages.join(' '),
        problems
      });
    }
    JobController.create(req.body)
    .then(result => {
      res.json({});
    })
    .catch(routeErrorHandlerFactory(res));
  }
);

module.exports = router;