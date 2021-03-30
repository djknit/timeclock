import React from 'react';
import getStyle from './style';
import Thead from './Head';
import RowsGroup from './RowsGroup';

function Table({
  rowGroups,
  hasTimes,
  hasSecondTzCol,
  hasEarningCols,
  ...propsForTheadOnly
}) {

  const style = getStyle();

  return (
    <table className="table">
      <Thead
        {...{
          hasTimes,
          ...propsForTheadOnly,
          hasSecondTzCol,
          hasEarningCols
        }}
      />
      <tbody>
        {rowGroups.map(
          (
            {
              rows,
              isTotals,
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
                isTotals
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
