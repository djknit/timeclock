const router = require('express').Router();

const WeekController = require('../../../controllers/Week');
const JobController = require('../../../controllers/Job');
const timeController = require('../../../controllers/time');

const { routeErrorHandlerFactory, checkRequiredProps, cleanJob } = require('../utilities');

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

router.post(
  '/add-segment-to-day',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['segment', 'dayId', 'weekId'], res);
    checkRequiredProps(req.body, ['segment.startTime', 'segment.endTime'], res);
    const { segment, dayId, weekId } = req.body;
    timeController.addSegmentToDay(segment, dayId, weekId, req.user._id)
    .then(result => res.json({ week: result }))
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
    .then(result => res.json({ job: result }))
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/delete-segment',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['segmentId', 'weekId', 'dayId'], res);
    const { segmentId, weekId, dayId } = req.body;
    WeekController.removeSegment(segmentId, dayId, weekId, req.user._id)
    .then(week => res.json({ week }))
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/delete-segments-for-date-range',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['firstDate', 'lastDate', 'jobId'], res);
    const { firstDate, lastDate, jobId } = req.body;
    timeController.deleteSegmentsInDateRange(firstDate, lastDate, jobId, req.user._id)
    .then(job => res.json({ job }))
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/delete-segments-for-dates',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['dates', 'jobId'], res);
    const { dates, jobId } = req.body;
    timeController.deleteSegmentsForDates(dates, jobId, req.user._id)
    .then(job => res.json({ job }))
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/delete-segments-for-day-ids',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['ids', 'jobId'], res);
    // expects `ids` to have the format [{ weekId: '', dayIds: ['', '', ...] }, ...]
    const { ids, jobId } = req.body;
    timeController.deleteSegmentsForDayIds(ids, jobId, req.user._id)
    .then(job => res.json({ job }))
    .catch(routeErrorHandlerFactory(res));
  }
);

module.exports = router;