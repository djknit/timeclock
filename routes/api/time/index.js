const router = require('express').Router();

const WeekController = require('../../../controllers/Week');
const JobConrtoller = require('../../../controllers/Job');
const timeController = require('../../../controllers/time');

const { routeErrorHandlerFactory } = require('../utilities');

// router.use('/weeks', require('./weeks'));
// router.use('/days', require('./days'));
// router.use('/segments', require('./segments'));

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

router.post(
  '/add-segment-to-day',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['segment', 'dayId', 'weekId'], res);
    checkRequiredProps(req.body, ['segment.startTime', 'segment.endTime'], res);
    const { segment, dayId, weekId } = req.body;
    // WeekController.addSegmentToDay(segment, dayId, weekId, req.user._id)
    timeController.addSegmentToDay(segment, dayId, weekId, req.user._id)
    .then(result => {
      res.json({
        frick: 'yeah',
        week: result
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
    const { segment, jobId } = req.body;
    timeController.addSegment(segment, jobId, req.user._id)
    .then(result => {
      res.json({ job: result })
    })
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/delete-segment',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['segmentId', 'weekId', 'dayId']);
    const { segmentId, weekId, dayId } = req.body;
    WeekController.removeSegment(segmentId, dayId, weekId, req.user._id)
    .then(result => {
      return res.json(result);
    })
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/delete-segments-for-date-range',
  (req, res) => {
    checkRequiredProps(req.body, ['firstDate', 'lastDate', 'jobId']);
    const { firstDate, lastDate, jobId } = req.body;
    WeekController.deleteSegmentsInDateRange(firstDate, lastDate, jobId, req.user._id)
    .then(result => res.json(result))
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/delete-segments-for-dates',
  (req, res) => {
    
  }
);

module.exports = router;

function checkRequiredProps(props, requiredPropNames, res) {
  let problems = {};
  let problemMessages = [];
  requiredPropNames.forEach(name => {
    checkRequiredProp(props, name, problems, problemMessages, name);
  });
  if (problemMessages.length > 0) {
    return res.status(400).json({
      message: problemMessages.join(' '),
      problems
    });
  }
}

function checkRequiredProp(props, propName, problems, problemMessages, propDisplayName) {
  const dotIndex = propName.indexOf('.');
  if (dotIndex > -1) {
    const parentPropName = propName.slice(0, dotIndex);
    const childPropName = propName.slice(dotIndex + 1);
    return checkRequiredProp(props[parentPropName], childPropName, problems, problemMessages, propDisplayName);
  }
  const prop = props[propName];
  if (!prop && prop !== 0 && prop !== '') {
    addProblem(propDisplayName, problems);
    problemMessages.push('Missing `' + propDisplayName + '`.');
  }
}

function addProblem(propDisplayName, problems) {
  const propDisplayNameLevels = propDisplayName.split('.');
  let parentProblemLevel = problems;
  const numberOfLevels = propDisplayNameLevels.length;
  for (let i = 0; i < numberOfLevels; i++) {
    let currentLevelName = propDisplayNameLevels[i];
    if (i === numberOfLevels - 1) {
      parentProblemLevel[currentLevelName] = true;
      return;
    }
    parentProblemLevel[currentLevelName] = {};
    parentProblemLevel = parentProblemLevel[currentLevelName];
  };
}