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
    const { user, body, params } = req;
    checkRequiredProps(body, ['password'], res);
    const wrongPasswordMsg = 'Incorrect password.';
    user.comparePassword(body.password)
    .then(({ isMatch }) => {
      if (isMatch) {
        return JobController.deleteJob(params._id, user._id);
      }
      else throw {
        message: wrongPasswordMsg,
        problems: { password: true },
        status: 422
      };
    })
    .then(user => res.json({ jobs: cleanJobsExtra(user.jobs) }))
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

router.post(
  '/rename/:_id',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['name'], res);
    JobController.changeName(req.params._id, req.user._id, req.body.name)
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