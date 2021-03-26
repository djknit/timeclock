import { getCurrencyAmountInfo } from '../../../currency';
import { getDurationInfo } from '../durationInfo';

// final processing of earnings before output
function formatEarnings(earningsByCurrency) {
  const _paidEarnings = earningsByCurrency.filter(({ currency }) => !!currency);
  if (_paidEarnings.length === 0) return null;
  return _paidEarnings.map(formatEarningsForCurrency);
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