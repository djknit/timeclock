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
  ...propsForTheadOnly
}) {

  const style = getStyle(styleProp);

  return (
    <table className="table" style={style.table}>
      <Thead
        {...{
          hasTimes,
          date,
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
                isTotals,
                date
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
