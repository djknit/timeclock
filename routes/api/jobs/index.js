const router = require('express').Router();

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

const JobController = require('../../../controllers/Job');
const UserController = require('../../../controllers/User');

const { routeErrorHandlerFactory, checkRequiredProps, cleanJob, cleanJobsExtra } = require('../utilities');

router.post(
  '/create',
  verifyLogin,
  (req, res) => {
    const userId = req.user._id;
    checkRequiredProps(req.body, ['name', 'timezone', 'startDate'], res);
    let newJob;
    UserController.checkForJobWithName(req.body.name, userId)
    .then(() => JobController.create(req.body, userId))
    .then(job => {
      newJob = job;
      return UserController.addJob(job._id, userId);
    })
    .then(user => {
      return res.json({
        jobs: cleanJobsExtra(user.jobs),
        newJob
      });
    })
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/delete/:_id',
  verifyLogin,
  (req, res) => {
    JobController.deleteJob(req.params._id, req.user._id)
    .then(result => res.json({ result }))
    .catch(routeErrorHandlerFactory(res));
  }
);

// This route is for updating value schedules for `wage`, `timezone`, `dayCutoff`, or `weekBegins`
router.post(
  '/update-setting/:propName',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['jobId', 'updates'], res);
    const { jobId, updates } = req.body;
    JobController.updatePropWithName(req.params.propName, updates, jobId, req.user._id)
    .then(job => res.json(cleanJob(job)))
    .catch(routeErrorHandlerFactory(res));
  }
);

router.get(
  '/:_id',
  verifyLogin,
  (req, res) => {
    JobController.getJobById(req.params._id, req.user._id)
    .then(job => res.json(cleanJob(job)))
    .catch(routeErrorHandlerFactory(res));
  }
);

module.exports = router;