import { cloneMyDate, getDurationInfo, getPaidAndUnpaidTotalTime } from '../../utilities';
import processDay from './processDay';
import { addEarningsToDays, getWeekEarnings } from './earnings';
import { getWeekSettings } from './settings';

export default function processWeek(weekDocument) {
  
  const { _id, days, firstDate, lastDate, weekNumber } = weekDocument;
  
  const processedDays = days.map(processDay);

  addEarningsToDays(processedDays);

  const { totalTime, daysWorked } = getTotalTimeAndDaysWorked(processedDays);
  const earnings = getWeekEarnings(processedDays);

  return {
    weekDocId: _id.toString(),
    firstDate: cloneMyDate(firstDate),
    lastDate: cloneMyDate(lastDate),
    weekNumber,
    days: processedDays,
    totalTime,
    earnings,
    settings: getWeekSettings(processedDays),
    daysWorked,
    ...getPaidAndUnpaidTotalTime(earnings, totalTime)
  };
};

function getTotalTimeAndDaysWorked(days) {
  let totalTimeInMsec = 0;
  let daysWorked = 0;
  days.forEach(({ totalTime }) => {
    totalTimeInMsec += totalTime.durationInMsec;
    if (totalTimeInMsec > 0) {
      daysWorked++;
    }
  });
  return {
    totalTime: getDurationInfo(totalTimeInMsec),
    daysWorked
  };
}