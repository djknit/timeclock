const router = require('express').Router();

const WeekController = require('../../../controllers/Week');
const JobController = require('../../../controllers/Job');
const timeController = require('../../../controllers/time');

const { routeErrorHandlerFactory, checkRequiredProps, resCleaners } = require('../utilities');

const { cleanJob } = resCleaners;

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
    timeController.addSegmentToDay(segment, dayId, weekId, req.user._id)
    .then(result => {
      res.json({
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
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['firstDate', 'lastDate', 'jobId']);
    const { firstDate, lastDate, jobId } = req.body;
    timeController.deleteSegmentsInDateRange(firstDate, lastDate, jobId, req.user._id)
    .then(result => res.json(result))
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/delete-segments-for-dates',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['dates', 'jobId']);
    const { dates, jobId } = req.body;
    timeController.deleteSegmentsForDates(dates, jobId, req.user._id)

  }
);

module.exports = router;