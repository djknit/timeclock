import React from 'react';
import Thead from './Head';
import RowsGroup from './RowsGroup';

function WideScreenTableContent({
  rowGroups,
  hasTimes,
  primaryTimezone,
  secondaryTimezone,
  hasSecondaryTzTimes,
  colRefs,
  ...otherProps
}) {

  return (
    <>
      <Thead
        {...{
          hasTimes,
          primaryTimezone,
          secondaryTimezone,
          hasSecondaryTzTimes,
          colRefs,
        }}
        {...otherProps}
      />
      <tbody>
        {rowGroups.map(
          ({ rows, hasTimes: groupHasTimes = hasTimes }, index) => (
            <RowsGroup
              key={index}
              {...otherProps}
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

export default WideScreenTableContent;
