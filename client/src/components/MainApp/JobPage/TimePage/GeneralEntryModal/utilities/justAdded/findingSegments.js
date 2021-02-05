import { findItemInArray } from '../../../utilities';
import { doesSegmentMatchInfo } from './elemental';

function findSegmentsFromSegmentInfo(segmentsInfo, weeks) {
  let ids = []; // used in `_unique()`
  return (
    segmentsInfo &&
    segmentsInfo.map(_findSingleSegFromInfo).filter(_exists).filter(_unique)
  );
  function _findSingleSegFromInfo(_segInfo) {
    const { dayId, weekId } = _segInfo;
    const _weekWithSeg = findItemWithId(weekId, weeks, 'weekDocId');
    const _dayWithSeg = findItemWithId(dayId, _weekWithSeg.days);
    const _segment = findSegmentOnDay(_dayWithSeg.segments, _segInfo);
    return _segment && {
      ..._segment,
      dayId,
      weekId,
      date: _dayWithSeg.date
    };
  }
  function _exists(_segment) { return !!_segment; }
  function _unique({ _id }) { return !ids.includes(_id) && ids.push(_id); }
}

function findItemWithId(id, array, idPropName = '_id') {
  const isItem = _item => _item[idPropName] === id.toString();
  return findItemInArray(array, isItem);
}

function findSegmentOnDay(daySegments, segmentInfo) {
  const isSegment = _seg => doesSegmentMatchInfo(_seg, segmentInfo);
  return findItemInArray(daySegments, isSegment);
}



export { findSegmentsFromSegmentInfo };
