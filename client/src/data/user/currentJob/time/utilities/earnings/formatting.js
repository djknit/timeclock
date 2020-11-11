import { getCurrencyAmountInfo, getDurationInfo } from '../../../utilities';

function formatEarningsForCurrency({ currency, rawAmount, totalTimeInMsec, rates }) {
  let result = {
    currency,
    totalTime: getDurationInfo(totalTimeInMsec)
  };
  if (!currency) return result;
  return {
    ...result,
    amount: getCurrencyAmountInfo(rawAmount, currency),
    rates: rates.map(
      ({ rate, durationInMsec, isOvertime, rawAmountEarned, wage }) => ({
        rate,
        duration: getDurationInfo(durationInMsec),
        isOvertime,
        amountEarned: getCurrencyAmountInfo(rawAmountEarned, currency),
        wage
      })
    )
  };
}

export { formatEarningsForCurrency };