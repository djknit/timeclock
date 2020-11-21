import { getDurationInfo } from '../../utilities';
export * from './formatting';
export * from './totalsCalc';

function getPaidAndUnpaidTotalTime(fullyProcessedEarnings, totalTime) {
  if (!fullyProcessedEarnings) {
    return {
      paidTime: getDurationInfo(0),
      unpaidTime: totalTime
    };
  };
  const unpaidTime = getTotalUnpaidTime(fullyProcessedEarnings);
  return {
    unpaidTime,
    paidTime: getDurationInfo(totalTime.durationInMsec - unpaidTime.durationInMsec)
  };
}

function getTotalUnpaidTime(earningsByCurrency) {
  for (let i = 0; i < earningsByCurrency.length; i++) {
    const { currency, totalTime } = earningsByCurrency[i];
    if (!currency) return totalTime;
  }
  return getDurationInfo(0);
}

export { getPaidAndUnpaidTotalTime };