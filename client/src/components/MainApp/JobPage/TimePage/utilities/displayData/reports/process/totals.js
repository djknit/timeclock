export { processTotals };


function processTotals({ totalTime, earnings, unpaidTime, paidTime }) {
  return {
    ...getProcessedRateAndCurrencyTotals(earnings),
    unpaid: unpaidTime,
    paid: paidTime,
    all: totalTime
  };
}

function getProcessedRateAndCurrencyTotals(unprocessedEarningsByCurrency) {
  if (!unprocessedEarningsByCurrency) {
    return { byCurrency: [] };
  }
  const totalsByCurrency = unprocessedEarningsByCurrency.map(
    ({ amount, currency, rates, totalTime }) => {
      return {
        duration: totalTime,
        amountEarned: amount,
        currency,
        byRate: getProcessedRateTotalsForCurrency({ currency, rates })
      };
    }
  );
  return { byCurrency: totalsByCurrency };
}

function getProcessedRateTotalsForCurrency({ currency, rates }) {
  return rates.map(
    ({ amountEarned, duration, isOvertime, rate }) => ({
      duration,
      amountEarned,
      payRate: {
        amount: rate,
        isOvertime,
        currency
      }
    })
  );
}

// RESULT OBJ FROM `processTotals` DESCRIPTION:
    // * matches descriptions in other related files
/* 
  processed `totals` obj result should have the form:
    {
      byCurrency: [{
        duration,
        amountEarned,
        byRate: [{ duration, payRate, amountEarned }],
        currency
      }],
      unpaid, (duration)
      all (duration)
    }

  each `payRate` has the form:
    {
      amount,
      isOvertime,
      currency
    }
    || `null` (for unpaid segments)
*/
