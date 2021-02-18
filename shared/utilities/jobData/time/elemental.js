module.exports = {
  isTimestampInDay
};


function isTimestampInDay(time, dayBoundaries, isRoundedForward) {
  const { startTime, endTime } = dayBoundaries;
  return (
    isRoundedForward !== false ?
    (startTime <= time && time < endTime) :
    (startTime < time && time <= endTime)
  );
}
