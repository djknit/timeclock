// import { constants } from '../../utilities';

// const { minsPerHr } = constants;

// function getDayCutoffTime(cutoffValueInMinutes, is24hr) {
//   const minutesPerDay = 24 * minsPerHr;
//   const cutoffTimeInMinutes = (cutoffValueInMinutes + minutesPerDay) % minutesPerDay;
//   let time = {
//     hour: Math.floor(cutoffTimeInMinutes / minsPerHr),
//     minute: cutoffTimeInMinutes % minsPerHr,
//     is24hr: !!is24hr
//   };
//   if (!is24hr) {
//     time.isPm = time.hour >= 12;
//     time.hour = (time.hour % 12) || 12;
//   }
//   return time;
// }

// export { getDayCutoffTime };