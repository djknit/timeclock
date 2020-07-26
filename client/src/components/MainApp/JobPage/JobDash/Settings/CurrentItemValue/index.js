import React from 'react';
import { jobData as jobDataUtils, getSimpleJobSettingValueText } from '../../../utilities';
import getStyle from './style';
import Wage from './Wage';

const { getMostRecentScheduleValueForDate, getDateForTime } = jobDataUtils;

function CurrentItemValueDisplay({
  propName,
  job
}) {

  const currentDate = getDateForTime(Date.now(), job, true);
  const currentValue = getMostRecentScheduleValueForDate(currentDate, job[propName]);

  const style = getStyle();

  return (
    propName === 'wage' ? (
      <Wage value={currentValue} />
    ) : (
      <p style={style.p}>
        <strong style={style.valueLabel}>
          Current Value:
        </strong>
        &ensp;
        {getSimpleJobSettingValueText(propName, currentValue)}
      </p>
    )
  );
}

export default CurrentItemValueDisplay;