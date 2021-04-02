import React from 'react';
import Row from '../Row';

function RowsGroup({
  rows,
  isTotals,
  ...otherProps
}) {

  return rows.map(
    (rowData, index) => (
      <Row
        key={index}
        {...{
          rowData,
          ...otherProps
        }}
        isTotal={isTotals}
        isFirstInGroup={index === 0}
      />
    )
  );
}

export default RowsGroup;
