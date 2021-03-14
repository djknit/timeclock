import { jobData as jobDataUtils } from '../../../../utilities';
import { getCurrentMonthsInfo } from './months';
import { getCurrentWeeksInfo } from './weeks';

const { getDateForTime } = jobDataUtils;

export { getInfoForCurrentTimePeriods };


function getInfoForCurrentTimePeriods(processedWeeks, jobSettings) {
  const today = getDateForTime(Date.now(), jobSettings, true);
  return {
    ...getCurrentMonthsInfo(processedWeeks, today),
    ...getCurrentWeeksInfo(processedWeeks, today, jobSettings)
  };
}
