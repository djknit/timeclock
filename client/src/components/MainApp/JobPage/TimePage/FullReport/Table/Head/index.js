import React from 'react';
import getStyle from './style';

function Thead({
  hasTimes,
  primaryTimezone,
  secondaryTimezone,
  primaryTzLabel,
  secondaryTzLabel,
  date,
  hasSecondTzCol,
  hasEarningCols
}) {

  let firstColLabel, lastColLabel;

  if (hasTimes) {
    firstColLabel = (
      primaryTzLabel ||
      `Times (${getTimezoneAbbreviation(primaryTimezone)})`
    );
    lastColLabel = (
      secondaryTzLabel ||
      `Job Timezone (${getTimezoneAbbreviation(secondaryTimezone, date)})`
    );
  }

  const style = getStyle();

  return (
    <thead>
      <Th>{firstColLabel}</Th>
      <Th>Hours Worked</Th>
      {hasEarningCols && (
        <>
          <Th>Pay Rate</Th>
          <Th>Amount Earned</Th>
        </> 
      )}
      {hasSecondTzCol && (
        <Th>{lastColLabel}</Th>
      )}
    </thead>
  );

  function Th(props) {
    return (
      <th style={style.th} {...props} />
    );
  }
}

export default Thead;
