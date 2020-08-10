import React from 'react';
import { jobData as jobDataUtils } from '../../../utilities';
import getStyle from './style';
import SettingValueDisplay from '../../../SettingValueDisplay';

const { getMostRecentScheduleValueForDate, getDateForTime } = jobDataUtils;

function CurrentItemValueDisplay({
  propName,
  job,
  disabled
}) {

  const currentDate = getDateForTime(Date.now(), job, true);
  const currentValue = getMostRecentScheduleValueForDate(currentDate, job[propName]);
  // console.log({ propName, currentValue })

  const style = getStyle();

  return (
    <SettingValueDisplay
      settingName={propName}
      value={currentValue}
      {...{ disabled }}
      hasP
      pStyle={style.p}
      label="Current Value"
    />
  );
}

export default CurrentItemValueDisplay;