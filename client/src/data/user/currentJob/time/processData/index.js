import processWeek from './processWeek';
import { getDurationInfo } from '../utilities';
import { getJobEarnings } from './earnings';

function processTimeData(rawWeeks) {
  if (!rawWeeks) return;
  const processedWeeks = rawWeeks.map(processWeek);

  return {
    weeks: processedWeeks,
    totalTime: getTotalTime(processedWeeks),
    earnings: getJobEarnings(processedWeeks)
  };
}

export default processTimeData;


function getTotalTime(weeks) {
  let totalTimeInMsec = 0;
  weeks.forEach(({ totalTime }) => {
    totalTimeInMsec += totalTime.durationInMsec;
  });
  return getDurationInfo(totalTimeInMsec);
}