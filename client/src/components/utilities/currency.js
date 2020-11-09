import React from 'react';

function getCurrencyMutiplierDisplay(multiplierDisplayValue, baseRateDisplayValue, multipliedRateDisplayValue) {
  // Currency characters from Arabic countries were causing big headache with display reordering seemingly at random due to quirks of text direction. The following mess seems to solve the problem while still preventing line-breaks at undesirable places. Not sure if it's all necessary.
  const noWrapStyle = { whiteSpace: 'nowrap', direction: 'ltr', unicodeBidi: 'isolate' };
  return (
    <>
      {multiplierDisplayValue}
      <span style={noWrapStyle}> &times; {baseRateDisplayValue}</span>
      <span> </span>
      <span style={noWrapStyle}>
        <span style={noWrapStyle}> = </span>
        <span>{multipliedRateDisplayValue}</span>
      </span>
    </>
  );
}

export {
  getCurrencyMutiplierDisplay
};