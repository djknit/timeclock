export * from '../../utilities';
export * from './inputs';

function findRecentlyAddedSegs(weeks, periodDurationInMsec) {
  if (!weeks || !periodDurationInMsec) return;
  const cutoffTime = Date.now() - periodDurationInMsec;
  let recentlyAdded = [];
  weeks.forEach(_findSegsInWeek);

  return recentlyAdded;

  function _findSegsInWeek(_week) {
    _week.days.forEach(_day => _findSegsInDay(_day, _week.id));
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
}

export {
  findRecentlyAddedSegs
};
