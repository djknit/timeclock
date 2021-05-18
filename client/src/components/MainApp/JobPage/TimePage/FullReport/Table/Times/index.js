import React from 'react';
import getStyle, { getDateStyle } from './style';
import {
  formatSegmentTimesForReportTable, getTimezoneAbbreviation
} from '../utilities';

function Times({
  dayDate,
  timezone, // only include if using `TwoTzTimes` component
  ...unformattedTimes
}) {

  const {
    startTime, endTime
  } = formatSegmentTimesForReportTable(unformattedTimes, dayDate);

  const style = getStyle(timezone);

  return (
    <>
      <TimeAndDateDisplay timeInfo={startTime} style={style.startTime} />
      &nbsp;&ndash;&nbsp;
      <TimeAndDateDisplay
        timeInfo={endTime}
        style={style.endTime}
        {...{ timezone }}
      />
    </>
  );
}

export default Times;


function DateDisplay({ date }) { // already formatted date
  const style = getDateStyle();
  return date ? (
    <>&nbsp;<span style={style.span}>{date}</span></>
  ) : (
    <></>
  );
}

function TimeAndDateDisplay({ timeInfo, style, timezone }) {
  const { date } = timeInfo;

  const dateDisp = <DateDisplay {...{ date }} />;

  const tzDisp = timezone && (
    <>&nbsp;({getTimezoneAbbreviation(timezone, date, true)})</>
  );

  return (
    <span {...{ style }}>
      {timeInfo.time}{dateDisp}{tzDisp}
    </span>
  );
}
