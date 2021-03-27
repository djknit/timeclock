import React from 'react';
import getStyle from './style';
import Week from './Week';
import Totals from './Totals';

function FullReport({
  processedTimeData,
  style: styleProp
}) {

  if (!processedTimeData) {
    return (<></>);
  }

  const { weeks, totals } = processedTimeData;

  const style = getStyle(styleProp);

  return (
    <article style={style.wholeReport}>
      <h1 style={style.reportTitle} className="title is-size-4">
        Full Report of All Time
      </h1>
      {weeks.map(week => (
        <Week
          key={week.weekDocId}
          {...{ week }}
        />
      ))}
      <Totals
        {...{ totals }}
      />
    </article>
  );
}

export default FullReport;
