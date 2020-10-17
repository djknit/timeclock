import { getCurrencyAmountInfo, areWagesEquivalent, getDurationInfo } from '../../utilities';

function getWeekEarnings(fullyProcessedDays) {
  let totalsForEachRateByWage = [];
  let totalUnpaidTimeInMsecs = 0;

  fullyProcessedDays.forEach(day => {
    const dayWage = day.settings.wage;
    if (!dayWage) {
      totalUnpaidTimeInMsecs += day.totalTime.durationInMsec;
      return;
    }
    let totalsForWage = totalsForEachRateByWage.filter(({ wage }) => areWagesEquivalent(wage, dayWage))[0];
    if (!totalsForWage) {
      totalsForWage = {
        wage: dayWage,
        rates: [],
        totalTimeInMsec: 0,
        rawTotalAmountEarned: 0
      };
      totalsForEachRateByWage.push(totalsForWage);
    }
    addDailyEarningsToTotals(day.earnings, totalsForWage);
  });

  const totalEarningsByCurrency = groupWageEarningsTotalsByCurrency(totalsForEachRateByWage);
  
  return totalEarningsByCurrency.map(currencyTotal => ({
    currency: currencyTotal.currency,
    amount: getCurrencyAmountInfo(currencyTotal.rawAmount, currencyTotal.currency),
    totalTime: getDurationInfo(currencyTotal.totalTimeInMsec),
    rates: currencyTotal.rates.map(rateTotals => ({
      rate: rateTotals.rate,
      duration: getDurationInfo(rateTotals.totalTimeInMsec),
      isOvertime: rateTotals.isOvertime,
      amountEarned: getCurrencyAmountInfo(rateTotals.rawAmount, currencyTotal.currency)
    }))
  }));
}

export {
  getWeekEarnings
};


function addDailyEarningsToTotals(dailyEarnings, totalsForWage) {
  dailyEarnings.rates.forEach((rateInfo => {
    let rateTotals = (
      totalsForWage.rates.filter(_rateTotal => _rateTotal.isOvertime === rateInfo.isOvertime)[0]
    );
    if (!rateTotals) {
      rateTotals = {
        rate: rateInfo.rate,
        totalTimeInMsec: 0,
        rawTotalAmountEarned: 0,
        isOvertime: rateInfo.isOvertime
      };
      totalsForWage.rates.push(rateTotals);
    }
    rateTotals.totalTimeInMsec += rateInfo.duration.durationInMsec;
    rateTotals.rawTotalAmountEarned += rateInfo.amountEarned.raw;
  }));
}

function groupWageEarningsTotalsByCurrency(totalEarningsByWage) {
  let totalEarningsByCurrency = [];

  totalEarningsByWage.forEach(totalsForWage => {
    const { currency } = totalsForWage.wage;
    let totalsForCurrency = (
      totalEarningsByCurrency.filter(currencyTotals => currencyTotals.currency === currency)[0]
    );
    if (!totalsForCurrency) {
      totalsForCurrency = {
        currency,
        rawAmount: 0,
        totalTimeInMsec: 0,
        rates: []
      };
      totalEarningsByCurrency.push(totalsForCurrency);
    }
    totalsForCurrency.rawAmount += totalsForWage.rawTotalAmountEarned;
    totalsForCurrency.totalTimeInMsec += totalsForWage.totalTimeInMsec;
    totalsForCurrency.rates.push(...totalsForWage.rates);
  });

  return totalEarningsByCurrency;
}