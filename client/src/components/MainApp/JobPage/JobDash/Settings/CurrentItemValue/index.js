import React from 'react';
import { jobData as jobDataUtils } from '../../../../utilities';
import getStyle from './style';

const { getMostRecentScheduleValueForDate } = jobDataUtils;

function getValueText(propName, value) {
  switch (propName) {
    case 'timezone':

      break;
    case 'weekBegins':

      break;
    case 'dayCutoff':

      break;
    case 'wage':

      break;
  }
}

function CurrentItemValueDisplay({
  label,
  propName,
  valueSchedule
}) {

  
  const currentValue = getMostRecentScheduleValueForDate(valueSchedule)

  const style = getStyle();

  if (valueSchedule.length === 1) {
    return (
      // <p style={style.p}>
      <>{getValueText(propName, currentValue)}</>
      // </p>
    );
  }

}

export default CurrentItemValueDisplay;