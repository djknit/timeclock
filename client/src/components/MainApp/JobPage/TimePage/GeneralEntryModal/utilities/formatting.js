import React from 'react';
import {
  convert24hrTimeToAmPm,
  dates as dateUtils,
  formatMyDate
} from '../../utilities';

const { areDatesEquivalent } = dateUtils;

function formatSegmentTimes({ startTime, endTime, date }) {
  const includeDates = !(
    areDatesEquivalent(startTime.date, date) && areDatesEquivalent(endTime.date, date)
  );
  return (
    <>{_formatTime(startTime)} &ndash; {_formatTime(endTime)}</>
  );
  function _formatTime(_startOrEndTime) {
    const _timePart = formatTime(convert24hrTimeToAmPm(_startOrEndTime.time));
    return includeDates ? (
      <>{_timePart}&nbsp;{formatMyDate(_startOrEndTime.date, 'MMM. D')}</>
    ) : (
      _timePart
    );
  }
}

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

function combineWords(words, isString) {
  if (isString) return words.join(' ');
  return words.map((word, index) => (
    <React.Fragment key={index}>
      {index !== 0 && (<>&nbsp;</>)}{word}
    </React.Fragment>
  ));
}

export {
  formatSegmentTimes,
  formatTime,
  formatDuration
};
