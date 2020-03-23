const router = require('express').Router();

const { routeErrorHandlerFactory } = require('../utilities');

const JobController = require('../../../controllers/Job');

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

// PROBABLY NOT NEEDED
// router.post(
//   '/get-by-date',
//   verifyLogin,
//   (req, res) => {
//     const user = req.user;
//     const { jobId, date } = req.body;
//     console.log(user);
//     // see if user has jobs and then check that jobId belongs to user.
//     if (user.jobs.length === 0) {
//       return res.json({
//         message: 'User has no jobs.',
//         problems: { jobId: true }
//       });
//     }
//     if (user.jobs.indexOf(jobId) === -1) {
//       return res.json({
//         message: 'Job ID does not belong to user.',
//         problems: { jobId: true }
//       });
//     }
//     // then lookup job and check if week with date exists
//     // then create week
//     // then add week to job (possible combined with previous step)
//     JobController.getWeekWithDate(date, jobId)
//     .then(weekDoc => {
//       res.json(weekDoc);
//     })
//     .catch(routeErrorHandlerFactory(res));
//   }
// );

module.exports = router;