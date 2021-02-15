import { dates as dateUtils } from '../../utilities';
export * from '../../utilities';
export * from './inputs';

const { areDatesEquivalent } = dateUtils;

function findRecentlyAddedSegs(weeks, periodDurationInMsec) {
  if (!weeks || !periodDurationInMsec) return;
  const cutoffTime = Date.now() - periodDurationInMsec;
  let recentlyAdded = [];
  weeks.forEach(_findSegsInWeek);
  recentlyAdded.sort(_sortRule);

  return recentlyAdded;

  function _findSegsInWeek(_week) {
    _week.days.forEach(_day => _findSegsInDay(_day, _week.weekDocId));
  }
  function _findSegsInDay(_day, _weekId) {
    let _segs = _day.segments.filter(_isRecentlyAdded);
    for (const _seg of _segs) {
      _seg.date = { ..._day.date };
      _seg.dayId = _day._id;
      _seg.weekId = _weekId;
    }
    recentlyAdded.push(..._segs);
  }
  function _isRecentlyAdded(_segment) {
    return _segment.created.time.utcTime >= cutoffTime;
  }
  function _sortRule(_seg1, _seg2) { // want newest first; if same age, then latest startTime first
    const _compare = _evaluator => _evaluator(_seg2) - _evaluator(_seg1);
    const _createdVal = _segX => _segX.created.time.utcTime;
    const _startTimeVal = _segX => _segX.startTime.utcTime;
    return (_compare(_createdVal) || _compare(_startTimeVal));
  }
}


function separateSegsByDateCreated(segments) {
  if (!segments) return segments;
  let separatedSegs = [];
  for (const seg of segments) {
    const segCreatedDate = seg.created.time.date;
    let segsForDate = _findSeparatedSegsWithDate(segCreatedDate);
    if (!segsForDate) {
      segsForDate = { date: segCreatedDate, segments: [] };
      separatedSegs.push(segsForDate);
    }
    segsForDate.segments.push(seg);
  }

  return separatedSegs;

  function _findSeparatedSegsWithDate(_date) {
    for (const _segsForDate of separatedSegs) {
      if (areDatesEquivalent(_segsForDate.date, _date)) {
        return _segsForDate;
      }
    }
  }
}


export {
  findRecentlyAddedSegs,
  separateSegsByDateCreated
};
