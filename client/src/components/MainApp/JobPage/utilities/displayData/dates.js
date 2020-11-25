import React, { Fragment } from 'react';
import { formatMyDate } from '../../utilities';

function getDateRangeText(startDate, endDate, isShort, dateFormatString, isCapitalized) {
  if (isShort) return getDateRangeShortText(startDate, endDate, dateFormatString, isCapitalized);
  const wordAll = isCapitalized ? 'All' : 'all';
  if (!startDate && !endDate) {
    return `${wordAll} time`;
  }
  const _formatDate = date => formatMyDate(date, dateFormatString);
  if (!startDate) {
    return <>{wordAll} dates prior to and including {_formatDate(endDate)}</>;
  }
  if (!endDate) {
    return <>{wordAll} dates on or after {_formatDate(startDate)}</>;
  }
  return <>{_formatDate(startDate)} until {_formatDate(endDate)}</>;
}

function getDateRangeShortText(startDate, endDate, dateFormatString, isCapitalized) {
  if (!startDate && !endDate) {
    return `${isCapitalized ? 'A' : 'a'}ll time`;
  }
  const getArrows = (
    (direction, n = 3) => {
      let arr = [];
      for (let i = 0; i < n; i++) {
        arr.push(
          <Fragment key={i}>
            <i className={`fas fa-caret-${direction}`} />
          </Fragment>
        );
        if (i !== n - 1) {
          arr.push(
            <Fragment key={i + .5}>&nbsp;</Fragment>
          );
        };
      }
      return arr;
    }
  );
  const getDateText = (date, arrowDirection) => (
    date ? formatMyDate(date, dateFormatString) : getArrows(arrowDirection)
  );
  return (
    <>{getDateText(startDate, 'left')}&ensp;&mdash;&ensp;{getDateText(endDate, 'right')}</>
  );
}

export {
  getDateRangeText,
  getDateRangeShortText
};