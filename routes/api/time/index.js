const router = require('express').Router();

const WeekController = require('../../../controllers/Week');
const JobConrtoller = require('../../../controllers/Job');

const { routeErrorHandlerFactory } = require('../utilities');

// router.use('/weeks', require('./weeks'));
// router.use('/days', require('./days'));
// router.use('/segments', require('./segments'));

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

router.post(
  '/add-segment-to-day',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(
      req.body,
      ['segment', 'dayId', 'weekId'],
      res
    );
    checkRequiredProps(req.body, ['segment.startTime', 'segment.endTime'], res);
    const { segment, dayId, weekId } = req.body;
    WeekController.addSegmentToDay(segment, dayId, weekId, req.user._id)
    .then(result => {
      res.json({
        frick: 'yeah',
        result
      });
    })
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/add-segment',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['segment', 'jobId'], res);
    checkRequiredProps(req.body, ['segment.startTime', 'segment.endTime'], res);
    // before getting week with date, need to determine date segment is in
      // user functions already made hopefully
    
    // JobConrtoller.getWeekWithDate(date, jobId)
  }
);

router.post(
  '/delete-segment',
  verifyLogin,
  (req, res) => {
    
  }
);

module.exports = router;

function checkRequiredProps(props, requiredPropNames, res) {
  let problems = {};
  let problemMessages = [];
  requiredPropNames.forEach(name => {
    if (!props[name]) {
      problems[name] = true;
      problemMessages.push(`Missing '${name}'.`);
    }
  });
  if (problemMessages.length) {
    return res.status(400).json({
      message: problemMessages.join(' '),
      problems
    });
  }
}