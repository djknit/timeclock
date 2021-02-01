const router = require('express').Router();

const {
  Week: WeekController,
  Job: JobController,
  time: timeController
} = require('../../../controllers');

const {
  routeErrorHandlerFactory, checkRequiredProps, cleanJob, cleanWeekDoc, weeksSenderFactory, cleanWeeks
} = require('../utilities');

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');
const segPropNames = (segName = 'segment') => ([`${segName}.startTime`, `${segName}.endTime`]);

router.post(
  '/add-segment-to-day',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['segment', 'dayId', 'weekId'], res);
    checkRequiredProps(req.body, segPropNames(), res);
    const { segment, dayId, weekId } = req.body;
    timeController.addSegmentToDay(segment, dayId, weekId, req.user._id)
    .then(({ weekDoc, newSegmentInfo }) => {
      res.json({
        week: cleanWeekDoc(weekDoc),
        newSegmentInfo
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
    checkRequiredProps(req.body, segPropNames(), res);
    const { segment, jobId } = req.body;
    timeController.addSegment(segment, jobId, req.user._id)
    .then(({ job, newSegmentInfo }) => {
      res.json({
        weeks: cleanWeeks(job.weeks),
        newSegmentInfo
      });
    })
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/add-segments',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['segments', 'jobId']);
    const { segments, jobId } = req.body;
    timeController.addMultipleSegments(segments, jobId, req.user._id)
    .then(({ job, newSegmentsInfo, error }) => {
      res.status(error ? 207 : 200).json({
        weeks: cleanWeeks(job.weeks),
        newSegmentsInfo,
        ...(error && { error })
      });
    })
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
    .then(week => res.json({ week: cleanWeekDoc(week) }))
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/edit-segment',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['segmentId', 'weekId', 'dayId', 'updatedTimes'], res);
    checkRequiredProps(req,body, segPropNames('updatedTimes'), res);
    const { updatedTimes, weekId, dayId, fragments } = req.body;
    [...fragments].forEach(el, index => {
      checkRequiredProps(req.body, segPropNames(`fragments.${index}`), res);
    });
    // IN CTRL FXN:
      // validate updates,
      // update segment
      // add fragments if any
        // will need to allow `created` and `modified` for add segments ctrl fxn parameters
  }
);

router.post(
  '/delete-segments-for-date-range',
  verifyLogin,
  (req, res) => {
    checkRequiredProps(req.body, ['firstDate', 'lastDate', 'jobId'], res);
    const { firstDate, lastDate, jobId } = req.body;
    timeController.deleteSegmentsInDateRange(firstDate, lastDate, jobId, req.user._id)
    .then(weeksSenderFactory(res))
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
    .then(weeksSenderFactory(res))
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
    .then(weeksSenderFactory(res))
    .catch(routeErrorHandlerFactory(res));
  }
);

module.exports = router;
