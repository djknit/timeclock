import { cloneMyDate, getDurationInfo } from '../utilities';
import processDay from './processDay';

export default function processWeek(weekDocument) {
  
  const { _id, days, firstDate, lastDate, weekNumber } = weekDocument;
  
  const processedDays = days.map(processDay);

  // still need to calculate wages
    // if wage changes during week:
      // calculate amount earned at each wage then add together if currencies are the same

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