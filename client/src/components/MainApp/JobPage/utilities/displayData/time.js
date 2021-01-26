import React from 'react';
import { roundNumToNDecimalDigits } from '../../utilities';
import { combineWords } from './elemental';

function formatTime({ hour, minute, amPm, is24hr }, isString) {
  let firstWord = `${hour}:`;
  if (minute < 10) firstWord += '0';
  firstWord += minute;
  if (is24hr) return firstWord;
  const resultWords = [firstWord, amPm.toUpperCase()];
  if (!isString) {
    resultWords[1] = (
      <span style={{ fontVariant: 'small-caps' }}>
        {amPm}
      </span>
    );
  }
  return combineWords(resultWords, isString);
}

function getHoursDurationDisplay(durationInfo) {
  const numHrs = roundNumToNDecimalDigits(durationInfo.durationInHours, 2);
  return `${numHrs} hours`;
}

function formatDuration(durationInfo, isString) {
  const { hours, minutes, seconds } = durationInfo;
  const displayMinutes = Math.round(minutes + (seconds / 60));
  let resultWords = [];
  if (hours !== 0) {
    resultWords.push(hours, 'hr');
  }
  if (displayMinutes !== 0 || hours === 0) {
    resultWords.push(displayMinutes, 'min');
  }
  return combineWords(resultWords, isString);
}

export {
  formatTime,
  getHoursDurationDisplay,
  formatDuration
};
