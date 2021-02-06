import { findItemInArray } from '../../../utilities';
import { doesSegmentMatchInfo } from './elemental';

function findSegmentsFromSegmentInfo(segmentsInfo, weeks) {
  if (!segmentsInfo) return;
  let matchingSegs = [];
  segmentsInfo.forEach(_findAllSegsMatchingInfo);
  return matchingSegs;

  function _findAllSegsMatchingInfo(_segInfo) {
    const { dayId, weekId } = _segInfo;
    const { date, segments } = findDayWithIdInWeeks({ dayId, weekId }, weeks);
    segments.forEach(_seg => {
      if (doesSegmentMatchInfo(_seg, _segInfo) && !findItemWithId(_seg._id, matchingSegs)) {
        matchingSegs.push({ ..._seg, dayId, weekId, date });
      }
    });
  }
}

function findDayWithIdInWeeks({ dayId, weekId }, weeks) {
  const week = findItemWithId(weekId, weeks, 'weekDocId');
  return findItemWithId(dayId, week.days);
}

function findItemWithId(id, array, idPropName = '_id') {
  const isItem = _item => _item[idPropName] === id.toString();
  return findItemInArray(array, isItem);
}

export { findSegmentsFromSegmentInfo };
