import { getDurationInfo } from '../durationInfo';
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

export { getPaidAndUnpaidTotalTime };
