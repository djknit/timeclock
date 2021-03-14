import { findItemInArray } from '../../../utilities';
import { doesSegmentMatchInfo } from './elemental';

/*~ ABOUT `segmentInfos`: ~~*~~~*~~~*~~~*~~~*~~~*~~~*~~~*~
  * Each `segmentInfo` object represents 1 segment at the time the segment was originally created.
  * If segment has been editted in such a way that it was split into multiple segments, the original segment info will map to all of the new segments generated from the split.
  * The `segmentInfo` also identifies (in `segmentInfo.days`) the day(s) that contain(ed) the original segment and any segments split off from the original seg via edits.
*/
function findSegmentsFromSegmentInfos(segmentInfos, weeks) {
  if (!segmentInfos) return;
  let matchingSegs = [];
  segmentInfos.forEach(_addMatchingSegsForSegInfo);
  return matchingSegs;
  function _addMatchingSegsForSegInfo(_segInfo) {
    for (const _dayInfo of _segInfo.days) {
      _addSegsForInfoFromDay(_segInfo, _dayInfo);
    }
  }
  function _addSegsForInfoFromDay(_segInfo, { dayId, weekId }) {
    const { date, segments } = findDayWithIdInWeeks({ dayId, weekId }, weeks);
    for (const _seg of segments) {
      if (doesSegmentMatchInfo(_seg, _segInfo) && !findItemWithId(_seg._id, matchingSegs)) {
        matchingSegs.push({ ..._seg, dayId, weekId, date });
      }
    }
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

export { findSegmentsFromSegmentInfos };
