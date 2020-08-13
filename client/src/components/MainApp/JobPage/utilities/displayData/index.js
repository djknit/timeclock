import React from 'react';
import { formatMyDate } from '../../utilities';

function getDateRangeText(startDate, endDate, isShort) {
  if (isShort) return getDateRangeShortText(startDate, endDate);
  if (!startDate && !endDate) {
    return 'all time';
  }
  if (!startDate) {
    return `all dates prior to and including ${formatMyDate(endDate)}`;
  }
  if (!endDate) {
    return `all dates on or after ${formatMyDate(startDate)}`;
  }
  return `${formatMyDate(startDate)} until ${formatMyDate(endDate)}`;
}

function getDateRangeShortText(startDate, endDate) {
  const dateFormatString = 'MMM. D, YYYY';
  if (!startDate && !endDate) {
    return 'all time';
  }
  const getDateText = date => (
    date ? formatMyDate(date, dateFormatString) : '...'
  );
  return (
    <>{getDateText(startDate)} &mdash; {getDateText(endDate)}</>
  );
}

export {
  getDateRangeText,
  getDateRangeShortText
};