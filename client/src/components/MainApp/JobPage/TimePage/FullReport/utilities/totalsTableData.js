export { getTotalsRowGroups };

function getTotalsRowGroups({
  totals: {
    byCurrency = [],
    paid,
    unpaid,
    all
  },
  reportHasPaidTime
}) {
/* 
  need: {
    rows: [{ rowLabel, duration, amountEarned, payRate }] 
  }

  If payRate is null but report has some paid time, include headings and null value signifiers for rate and earnings in table

*/
  if (!reportHasPaidTime) {
    return [getTotalTimeRowGroup(all)];
  }

  if ( // multiple currencies or both paid & unpaid
    (byCurrency && byCurrency.length) > 1 ||
    (isNonZero(paid) && isNonZero(unpaid))
  ) {
    return {

    }; // * * *
  }

  // should group w/ 1 curr. mult. rates (below), for reuse w/ mult. curr. (above)
  if (isNonZero(paid) && byCurrency[0].byRate.length === 1) { // 1 currency and 1 rate only
    return [getCurrencyGrandTotalRowGroup(byCurrency[0])];
  }

    // 1 currency and multiple pay rates
  return [getCurrencyTotalsRateGroups(byCurrency[0])];
}

function isNonZero(durationInfo) {
  return (durationInfo && durationInfo.durationInMsec) > 0;
}

function getTotalTimeRowGroup(totalTime) {
  return getRowGroupInfoObj([{
    duration: totalTime,
    rowLabel: 'Total Time:'
  }]);
}

function getCurrencyGrandTotalRowGroup({ currency, duration, amountEarned, byRate = [] }) {
  return getRowGroupInfoObj([{
    duration,
    rowLabel: `${currency} Totals:`,
    amountEarned,
    payRate: byRate.length === 1 ? byRate[0].payRate : undefined
  }]);
}

function getCurrencyTotalsRateGroups({ currency, duration, amountEarned, byRate = [] }) {
  const rateTotalRowInfos = byRate.map(
    (totalsForRate, index) => ({
      ...totalsForRate,
      rowLabel: index === 0 ? `${currency} Totals By Pay Rate` : undefined
    })
  );
  return [
    getRowGroupInfoObj(rateTotalRowInfos),
    getCurrencyGrandTotalRowGroup({ currency, duration, amountEarned })
  ];
}

function getRowGroupInfoObj(rows) { // for totals only
  return { rows, hasTimes: false };
}
