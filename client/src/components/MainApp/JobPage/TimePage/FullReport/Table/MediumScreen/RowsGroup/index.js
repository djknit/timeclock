import React from 'react';
import Row from '../Row';

function RowsGroup({
  rows,
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
        isFirstInGroup={index === 0}
      />
    )
  );
}

export default RowsGroup;
