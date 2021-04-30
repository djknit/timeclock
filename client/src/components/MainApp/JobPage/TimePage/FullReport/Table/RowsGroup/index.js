import React from 'react';

function RowsGroup({
  rows,
  RowComponent,
  ...otherProps
}) {

  return rows.map(
    (rowData, index) => (
      <RowComponent
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
