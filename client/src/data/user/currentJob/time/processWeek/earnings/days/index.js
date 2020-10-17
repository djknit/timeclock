import { getWeekSectionEarnings } from './weekSection';

function addEarningsToDays(days) {
  let cumulativeMsecsWorked = 0;
  days.forEach(day => {
    addEarningsToDay(day, cumulativeMsecsWorked);
    cumulativeMsecsWorked += day.totalTime.durationInMsec;
  });
};

function addEarningsToDay(day, cumulativeWeeklyTime) {
  const { wage } = day.settings;
  let _cumulativeTime = cumulativeWeeklyTime;
  day.segments.forEach(segment => {
    addEarningsToSegment(segment, wage, _cumulativeTime); 
    _cumulativeTime += segment.duration.durationInMsec;
  });
  day.earnings = getWeekSectionEarnings(day.totalTime.durationInMsec, wage, cumulativeWeeklyTime);
}

function addEarningsToSegment(segment, wage, cumulativeWeeklyTime) {
  segment.earnings = getWeekSectionEarnings(
    segment.duration.durationInMsec, wage, cumulativeWeeklyTime
  );
}

export { addEarningsToDays };