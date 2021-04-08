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
  
  if (!reportHasPaidTime) {
    return [getTotalTimeRowGroup(all)];
  }

  let rowGroups = [];

  for (const currencyTotals of byCurrency) {
    if (currencyTotals.byRate.length > 1) {
      rowGroups.push(getRateTotalsRowGroup(currencyTotals));
    }
    rowGroups.push(getCurrencyGrandTotalRowGroup(currencyTotals));
  }

  if (isNonZero(unpaid)) {
    rowGroups.push(getUnpaidTotalRowGroup(unpaid));
  }

  if ( // multiple currencies or both paid & unpaid
    (byCurrency && byCurrency.length) > 1 ||
    (isNonZero(paid) && isNonZero(unpaid))
  ) {
    rowGroups.push(getTotalTimeRowGroup(all));
  }
console.log(rowGroups)
  return rowGroups;
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

function getRateTotalsRowGroup({ currency, byRate = [] }) {
  return getRowGroupInfoObj(
    byRate.map((totalsForRate, index) => ({
      ...totalsForRate,
      rowLabel: index === 0 ? `${currency} Totals By Pay Rate` : undefined
    }))
  );
}

function getCurrencyGrandTotalRowGroup({ currency, duration, amountEarned, byRate = [] }) {
  return getRowGroupInfoObj([{
    duration,
    rowLabel: `${currency} Totals:`,
    amountEarned,
    payRate: byRate.length === 1 ? byRate[0].payRate : undefined
  }]);
}

function getUnpaidTotalRowGroup(unpaidTime) {
  return getRowGroupInfoObj([{
    duration: unpaidTime,
    rowLabel: 'Total Unpaid Time:',
    amountEarned: null,
    payRate: null
  }]);
}

function getRowGroupInfoObj(rows) { // for totals only
  return { rows, hasTimes: false };
}
