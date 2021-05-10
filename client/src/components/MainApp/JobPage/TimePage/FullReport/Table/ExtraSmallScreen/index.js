import React from 'react';
// import getStyle from './style';
// import { getTimezoneAbbreviation } from './utilities';
import Thead from '../Head';
import RowsGroup from '../RowsGroup';
import Row from './Row';

function ExtraSmallWidthTableContent({
  rowGroups,
  hasTimes,
  hasSecondaryTzTimes,
  colRefs,
  ...otherProps
}) {
  
  const commonAttrs = {
    ...otherProps,
    hasSecondTzCol: false
  };

  const primaryTzLabel = hasTimes && hasSecondaryTzTimes && 'Times';
  // const style = getStyle(styleProp, colWidths);

  return (
    <>
      <Thead
        {...{
          ...commonAttrs,
          hasTimes,
          hasSecondaryTzTimes,
          colRefs,
          primaryTzLabel
        }}
      />
      <tbody>
        {rowGroups.map(
          ({ rows, hasTimes: groupHasTimes = hasTimes }, index) => (
            <RowsGroup
              key={index}
              {...commonAttrs}
              {...{ rows }}
              hasEarningCols={false}
              RowComponent={Row}
              hasTimes={groupHasTimes}
              hasSecondaryTzTimes={groupHasTimes && hasSecondaryTzTimes}
            />
          )
        )}
      </tbody>
    </>
  );
}

export default ExtraSmallWidthTableContent;
