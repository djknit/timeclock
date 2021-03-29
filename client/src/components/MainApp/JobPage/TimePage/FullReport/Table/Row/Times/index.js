import React from 'react';
import getStyle from './style';

function Times({
  startTime,
  endTime
}) {

  const style = getStyle();

  return (
    <>
      <span style={style.startTime}>

      </span>
      &ndash;
      <span stye={style.endTime}>

      </span>
    </>
  );
}

export default Times;
