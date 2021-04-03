import React from 'react';
import getStyle, { getDateStyle } from './style';
import { formatSegmentTimesForReportTable } from '../../utilities';

function Times({
  dayDate,
  ...unformattedTimes
}) {

  const {
    startTime, endTime
  } = formatSegmentTimesForReportTable(unformattedTimes, dayDate);

  const style = getStyle();

  return (
    <>
      {/* <span style={style.startTime}>
        {startTime.time}<DateDisplay date={startTime.date} />
      </span> */}
      <TimeAndDateDisplay timeInfo={startTime} style={style.startTime} />
      &nbsp;&ndash;&nbsp;
      <TimeAndDateDisplay timeInfo={endTime} style={style.endTime} />
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

function TimeAndDateDisplay({ timeInfo, style }) {
  return (
    <span {...{ style }}>
      {timeInfo.time}<DateDisplay date={timeInfo.date} />
    </span>
  );
}
