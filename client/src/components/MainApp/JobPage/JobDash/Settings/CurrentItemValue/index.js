import React from 'react';
import getStyle from './style';

function CurrentItemValueDisplay({
  label,
  propName,
  valueSchedule,
  isLast
}) {

  const style = getStyle();

  if (valueSchedule.length === 1) {
    return (
      // <p style={style.p}>
        <>Lorem ipsum doot doodle doot doo</>
      // </p>
    );
  }

}

export default CurrentItemValueDisplay;

function getValueText() {}