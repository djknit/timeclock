import { cloneMyDate } from '../utilities';
import processDay from './processDay';

export default function processWeek(weekDocument) {
  
  const { _id, days, firstDate, lastDate, weekNumber } = weekDocument;

  return {
    weekDocId: _id.toString(),
    firstDate: cloneMyDate(firstDate),
    lastDate: cloneMyDate(lastDate),
    weekNumber,
    days: days.map(processDay)
  };
};