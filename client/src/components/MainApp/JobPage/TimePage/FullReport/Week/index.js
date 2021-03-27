import React from 'react';
import getStyle from './style';
import InnerAreaHeader from '../../InnerAreaHeader';

function Week({
  week: {
    isPartial,
    totals,
    weekNumber,
    dateRange,
    days,
    weekDocId
  }
}) {
  
  return (
    <>
      <InnerAreaHeader label={`Week ${weekNumber}`} />
    </>
  );
}

export default Week;
