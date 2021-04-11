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
  secondaryTimezone
}) {

  const hasSecondaryTzTimes = (
    hasSecondTzTimesProp === undefined ?
    primaryTimezone !== secondaryTimezone :
    hasSecondTzTimesProp
  );

  const style = getStyle(styleProp);

  return (
    <table className="table" style={style.table}>
      <Thead
        {...{
          hasTimes,
          date,
          primaryTimezone,
          secondaryTimezone,
          hasEarningCols,
          hasSecondTzCol,
          hasSecondaryTzTimes
        }}
      />
      <tbody>
        {rowGroups.map(
          (
            {
              rows,
              // isTotals,
              hasTimes: groupHasTimes = hasTimes
            },
            index
          ) => (
            <RowsGroup
              key={index}
              {...{
                rows,
                hasSecondTzCol,
                hasEarningCols,
                // isTotals,
                date,
                hasSecondaryTzTimes
              }}
              hasTimes={groupHasTimes}
            />
          )
        )}
      </tbody>
    </table>
  );
}

export default Table;
