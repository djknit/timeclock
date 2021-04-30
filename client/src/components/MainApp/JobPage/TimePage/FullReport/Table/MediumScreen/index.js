import React from 'react';
import getStyle from './style';
import Thead from '../Head';
import RowsGroup from '../RowsGroup';
import Row from './Row';

function Table({
  rowGroups,
  hasTimes,
  primaryTimezone,
  secondaryTimezone,
  hasSecondaryTzTimes,
  colRefs,
  ...otherProps
}) {
  
  const commonAttrs = {
    ...otherProps,
    hasSecondTzCol: false
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

export default Table;
