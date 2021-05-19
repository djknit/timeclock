import React from 'react';
import { formatMyDate } from '../../utilities';
import { getTotalsRowGroups } from './totalsTableData';
export * from '../../utilities';
export * from './totalsTableData';

export {
  getWeekDateRangeText,
  getNumTablesInReport,
  getNumTableRowsInReport,
  getWidthOfEl
};


function getWeekDateRangeText({ dateRange } = {}, isString) {
  if (!dateRange) return;
  const { firstDate, lastDate } = dateRange;
  const shortFormatString = 'MMM. D';
  const longFormatString = `${shortFormatString}, YYYY`;
  const firstDateFormatStr = firstDate.year === lastDate.year ? shortFormatString : longFormatString;
  const firstDateText = formatMyDate(firstDate, firstDateFormatStr, isString);
  const lastDateText = formatMyDate(lastDate, longFormatString, isString);
  return isString ? (
    `${firstDateText} – ${lastDateText}`
  ) : (
    <>{firstDateText}&nbsp;&ndash;&nbsp;{lastDateText}</>
  );
}

function getNumTablesInReport(timeDataProcessedForReport) {
  if (!timeDataProcessedForReport || !timeDataProcessedForReport.weeks) {
    return;
  }
  let totalNumberOfTables = 1; // 1 grand totals table
  timeDataProcessedForReport.weeks.forEach(({ days }) => {
    totalNumberOfTables += (days.length + 1); // 1 table for each day and 1 week totals table
  });
  return totalNumberOfTables;
}

function getNumTableRowsInReport(timeDataProcessedForReport) {
  if (!timeDataProcessedForReport || !timeDataProcessedForReport.weeks) {
    return;
  }
  let totalNumTableRows = getTotalsRowGroups(timeDataProcessedForReport.totals).length;
  timeDataProcessedForReport.weeks.forEach(({ days, totals }) => {
    totalNumTableRows += getTotalsRowGroups(totals).length;
    days.forEach(({ segments }) => {
      totalNumTableRows += (segments.length + 1); // 1 day total row
    });
  });
  return totalNumTableRows;
}

function getWidthOfEl(elRef) {
  return elRef && elRef.current && elRef.current.clientWidth;
}
