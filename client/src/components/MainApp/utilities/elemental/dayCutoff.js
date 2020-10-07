// function getDayCutoffTime(cutoffValueInMinutes, is24hr) {
//   const minutesPerDay = 24 * 60;
//   const cutoffTimeInMinutes = (cutoffValueInMinutes + minutesPerDay) % minutesPerDay;
//   let time = {
//     hour: Math.floor(cutoffTimeInMinutes / 60),
//     minute: cutoffTimeInMinutes % 60,
//     is24hr: !!is24hr
//   };
//   if (!is24hr) {
//     time.isPm = time.hour >= 12;
//     time.hour = (time.hour % 12) || 12;
//   }
//   return time;
// }

// export { getDayCutoffTime };