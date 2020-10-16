import { cloneMyDate, getDurationInfo } from '../utilities';
import processDay from './processDay';
import { addEarningsToDays } from './earnings';

export default function processWeek(weekDocument) {
  
  const { _id, days, firstDate, lastDate, weekNumber } = weekDocument;
  
  const processedDays = days.map(processDay);

  addEarningsToDays(processedDays);

  return {
    weekDocId: _id.toString(),
    firstDate: cloneMyDate(firstDate),
    lastDate: cloneMyDate(lastDate),
    weekNumber,
    days: processedDays,
    totalTime: getTotalDurationInfo(processedDays)
  };
};

function getTotalDurationInfo(days) {
  let totalTimeInMsec = 0;
  days.forEach(({ totalTime }) => {
    totalTimeInMsec += totalTime.durationInMsec;
  });
  return getDurationInfo(totalTimeInMsec);
}