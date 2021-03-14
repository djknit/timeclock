import { areWagesEquivalent } from '../../wage';

function getWeekSettings(processedDays) {
  let weekSettings = {
    wage: [],
    dayCutoff: [],
    timezone: []
  };

  processedDays.forEach(day => {
    addDaySettingsToWeekSettings(day, weekSettings);
  });

  return weekSettings;
}

export { getWeekSettings };


function addDaySettingsToWeekSettings(day, weekSettings) {
  Object.keys(weekSettings).forEach(settingName => {
    const weekInfoForValue = getWeekInfoForValue(day.settings[settingName], settingName, weekSettings);
    weekInfoForValue.dates.push(day.date);
  });
}

function getWeekInfoForValue(value, settingName, weekSettings) {
  // This function only looks at last week value for setting, so that dates for each value are consecutive but value may appear twice.
  const newInfoObjForValue = { value, dates: [] };
  const _areValuesEquivalent = settingName === 'wage' ? areWagesEquivalent : areValuesEqual;
  const _weekSettingObjs = weekSettings[settingName];
  if (_weekSettingObjs.length === 0) {
    _weekSettingObjs.push(newInfoObjForValue);
    return newInfoObjForValue;
  };
  const _lastSettingInfoObj = _weekSettingObjs[_weekSettingObjs.length - 1];
  if (_areValuesEquivalent(value, _lastSettingInfoObj.value)) {
    return _lastSettingInfoObj;
  }
  _weekSettingObjs.push(newInfoObjForValue);
  return newInfoObjForValue;
}

function areValuesEqual(value_1, value_2) {
  return value_1 === value_2;
}
