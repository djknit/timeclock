import { constants } from '../../utilities';
export * from '../../utilities';
export * from './inputs';

const { secsPerMin } = constants;

function findRecentlyAddedSegs(weeks, periodDurationInMins) {
  if (!weeks || !periodDurationInMins) return;
  const periodDurInMsec = periodDurationInMins * secsPerMin * 1000;
  const cutoffTime = Date.now() - periodDurInMsec;
  let recentlyAdded = [];
  weeks.forEach(_findSegsInWeek);

  return recentlyAdded;

  function _findSegsInWeek(_week) {
    _week.days.forEach(_findSegsInDay);
  }
  function _findSegsInDay(_day) {
    recentlyAdded.push(..._day.segments.filter(_isRecentlyAdded));
  }
  function _isRecentlyAdded(_segment) {
    return _segment.created.time.utcTime >= cutoffTime;
  }
}

export {
  findRecentlyAddedSegs
};
