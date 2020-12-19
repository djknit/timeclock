import { dates as dateUtils } from '../../../utilities';
import { getSegmentBoundaryDayDates } from './elemental';

const { getMoment } = dateUtils;

function getNumDaysSpannedBySegment(segInputVals, timezone, job) {
  const boundaryDayDates = getSegmentBoundaryDayDates(segInputVals, timezone, job);
  const startDayMoment = getMoment(boundaryDayDates.firstDay);
  const endDayMoment = getMoment(boundaryDayDates.lastDay);
  return endDayMoment.diff(startDayMoment, 'days') + 1;
}

export {
  getNumDaysSpannedBySegment
};
