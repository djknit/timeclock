import React from 'react';
import getStyle from './style';
import Thead from './Head';
import RowsGroup from './RowsGroup';

function Table({
  rowGroups,
  hasTimes,
  hasSecondTzCol,
  hasEarningCols,
  date,
  style: styleProp,
  hasSecondaryTzTimes: hasSecondTzTimesProp,
  primaryTimezone,
  secondaryTimezone,
  hasSecondaryTzTimes,
  colWidths,
  colRefs
}) {
  
  const commonAttrs = {
    date,
    hasEarningCols,
    hasSecondTzCol,
    colWidths,
  };

  // const style = getStyle(styleProp, colWidths);

  return (
    <>
      <Thead
        {...{
          ...commonAttrs,
          hasTimes,
          primaryTimezone,
          secondaryTimezone,
          hasSecondaryTzTimes,
          colRefs,
        }}
      />
      <tbody>
        {rowGroups.map(
          ({ rows, hasTimes: groupHasTimes = hasTimes }, index) => (
            <RowsGroup
              key={index}
              {...commonAttrs}
              {...{ rows }}
              hasTimes={groupHasTimes}
              hasSecondaryTzTimes={groupHasTimes && hasSecondaryTzTimes}
            />
          )
        )}
      </tbody>
    </>
  );
}

export default Table;
