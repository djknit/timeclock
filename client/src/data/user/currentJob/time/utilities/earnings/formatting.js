import { getCurrencyAmountInfo, getDurationInfo } from '../../../utilities';

// final processing of earnings before output
function formatEarnings(earningsByCurrency) {
  if (earningsByCurrency.length === 0) return null;
  return earningsByCurrency.map(formatEarningsForCurrency);
}

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

export { formatEarnings };