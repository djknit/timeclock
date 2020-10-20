export { jobData } from './shared';

function getDayCutoffTime(cutoffValueInMinutes) {
  const minutesPerDay = 24 * 60;
  const cutoffTimeInMinutes = (cutoffValueInMinutes + minutesPerDay) % minutesPerDay;
  let time = {
    hour: Math.floor(cutoffTimeInMinutes / 60),
    minute: cutoffTimeInMinutes % 60,
    is24hr: true
  };
  return time;
}

export { getDayCutoffTime };