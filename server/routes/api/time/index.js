const router = require('express').Router();
const {
  Week: WeekController,
  time: timeController
} = require('../../../controllers');
const {
  routeErrorHandlerFactory,
  checkRequiredProps,
  cleanWeekDoc,
  weeksSenderFactory,
  cleanWeeks,
  sendWeeksAndErrorRes
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
      sendWeeksAndErrorRes(res, job, error, { newSegmentsInfo });
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
    checkRequiredProps(req.body, ['segmentId', 'weekId', 'dayId'], res);
    if (req.body.updatedTimes) {
      checkRequiredProps(req.body, segPropNames('updatedTimes'), res);
    }
    const { updatedTimes, weekId, dayId, segmentId, fragments } = req.body;
    (fragments || []).forEach((el, index) => {
      checkRequiredProps(req.body, segPropNames(`fragments.${index}`), res);
    });
    timeController
    .editSegment(segmentId, weekId, dayId, req.user._id, updatedTimes, fragments)
    .then(({ job, updatedSegments, error }) => {
      const resData = (
        updatedSegments.length > 0 ?
        { updatedSegments } :
        { updatedSegment: updatedSegments[0] }
      );
      sendWeeksAndErrorRes(res, job, error, resData);
    })
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
