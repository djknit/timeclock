import React from 'react';
import { jobData as jobDataUtils } from '../../../utilities';
import getStyle from './style';
import SettingValueDisplay from '../../../SettingValueDisplay';

const { getMostRecentScheduleValueForDate, getDateForTime } = jobDataUtils;

function CurrentItemValueDisplay({
  propName,
  settings,
  disabled
}) {

  const currentDate = getDateForTime(Date.now(), settings, true);
  const currentValue = getMostRecentScheduleValueForDate(currentDate, settings[propName]);

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