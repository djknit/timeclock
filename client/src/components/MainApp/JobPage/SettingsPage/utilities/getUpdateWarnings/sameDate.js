import React from 'react';
import {
  dates as dateUtils,
  formatMyDate
} from '../../../utilities';

const { areDatesEquivalent } = dateUtils;

function findIndexOfSchedEntryWithDate(date, schedule) {
  if (!date || !schedule || schedule.length === 1) return null;
  for (let i = 1; i < schedule.length; i++) {
    if (areDatesEquivalent(schedule[i].startDate, date)) {
      return i;
    }
  }
  return null;
}

function doesEntryExistWithStartDate(date, schedule) {
  const indexOfEntryWithDate = findIndexOfSchedEntryWithDate(date, schedule);
  return !!(indexOfEntryWithDate || indexOfEntryWithDate === 0);
}

function getEntryWithDateExistsWarning(date, schedule, warningMessages, settingDisplayName) {
  const needsWarning = doesEntryExistWithStartDate(date, schedule);
  if (needsWarning) {
    warningMessages.push(
      <>You already have a {settingDisplayName.toLowerCase()} value with the same start date ({formatMyDate(date)}).</>
    );
  }
  return needsWarning;
}


export { getEntryWithDateExistsWarning };