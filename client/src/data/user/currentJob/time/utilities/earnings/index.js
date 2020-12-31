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
  const paidTime = getTotalPaidTme(fullyProcessedEarnings);
  return {
    paidTime,
    unpaidTime: getDurationInfo(totalTime.durationInMsec - paidTime.durationInMsec)
  };
}

function getTotalPaidTme(fullyProcessedEarnings) {
  let paidTotalInMsec = 0;
  fullyProcessedEarnings.forEach(({ currency, totalTime }) => {
    if (!!currency) paidTotalInMsec += totalTime.durationInMsec;
  });
  return getDurationInfo(paidTotalInMsec);
}

// earnings for `currency: null` removed in previous step, so following function won't work anymore 
// function getTotalUnpaidTime(earningsByCurrency) {
//   for (let i = 0; i < earningsByCurrency.length; i++) {
//     const { currency, totalTime } = earningsByCurrency[i];
//     if (!currency) return totalTime;
//   }
//   return getDurationInfo(0);
// }

export { getPaidAndUnpaidTotalTime };