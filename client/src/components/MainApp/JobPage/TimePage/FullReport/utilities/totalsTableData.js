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

  const hasPaidTime = isNonZero(paid);
  const hasUnpaidTime = isNonZero(unpaid);

  if (!reportHasPaidTime || (!hasPaidTime && !hasUnpaidTime)) {
    return [getTotalTimeRowGroup(all, reportHasPaidTime)];
  }

  let rowGroups = [];

  for (const currencyTotals of byCurrency) {
    if (currencyTotals.byRate.length > 1) {
      rowGroups.push(getRateTotalsRowGroup(currencyTotals));
    }
    rowGroups.push(getCurrencyGrandTotalRowGroup(currencyTotals));
  }

  if (hasUnpaidTime) {
    rowGroups.push(getUnpaidTotalRowGroup(unpaid));
  }

  if (
    (byCurrency && byCurrency.length) > 1 ||
    (hasPaidTime && hasUnpaidTime)
  ) {
    rowGroups.push(getTotalTimeRowGroup(all));
  }

  return rowGroups;
}


function isNonZero(durationInfo) {
  return (durationInfo && durationInfo.durationInMsec) > 0;
}

function getTotalTimeRowGroup(totalTime, hasNullEarnings) {
  return getRowGroupInfoObj([{
    duration: totalTime,
    rowLabel: 'Total Time',
    amountEarned: hasNullEarnings ? null : undefined
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
    rowLabel: `${currency} Total`,
    amountEarned,
    payRate: byRate.length === 1 ? byRate[0].payRate : undefined
  }]);
}

function getUnpaidTotalRowGroup(unpaidTime) {
  return getRowGroupInfoObj([{
    duration: unpaidTime,
    rowLabel: 'Total Unpaid Time',
    amountEarned: null,
    payRate: null
  }]);
}

function getRowGroupInfoObj(rows) { // for totals tables only
  return { rows, hasTimes: false };
}
