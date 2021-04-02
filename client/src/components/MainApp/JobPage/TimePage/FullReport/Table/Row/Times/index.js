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
      <span style={style.startTime}>
        {startTime.time}<DateDisplay date={startTime.date} />
      </span>
      &nbsp;&ndash;&nbsp;
      <span style={style.endTime}>
        {endTime.time}<DateDisplay date={endTime.date} />
      </span>
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
