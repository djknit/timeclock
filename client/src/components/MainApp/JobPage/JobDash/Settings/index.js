import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';
import CurrentItemValueDisplay from './CurrentItemValue';

const settingsLabelsAndPropNames = [
  {
    label: 'Timezone',
    propName: 'timezone',
    // pagePath: 'timezone'
  },
  {
    label: 'Wage',
    propName: 'wage',
    // pagePath: 'wage'
  },
  {
    label: 'New Weeks Begin On:',
    propName: 'weekBegins',
    // pagePath: 'week-begins'
  },
  {
    label: 'Day Cutoff',
    propName: 'dayCutoff',
    // pagePath: 'day-cutoff'
  }
];

function SettingsArea({
  style: styleProp,
  disabled,
  settings,
  buildSettingsSubPath,
  jobSettingsPageSubpaths
}) {

  const style = getStyle(styleProp);

  return settings && (
    <ContentArea style={style.contentArea}>
      <ContentAreaTitle>Settings Summary</ContentAreaTitle>
      {
        settingsLabelsAndPropNames.map(
          ({ label, propName }, index) => (
            <div
              style={{
                ...(
                  index === settingsLabelsAndPropNames.length - 1 ?
                  style.lastAreaHasBtns :
                  style.areaNotLastHasBtns
                ),
                ...style.settingValueArea
              }}
              key={label}
            >
              <p style={style.areaLabel}>
                {label}
              </p>
              <CurrentItemValueDisplay
                {...{
                  propName,
                  settings,
                  disabled
                }}
              />
              {settings[propName].length > 1 && (
                <p style={style.areaHasBtnsText}>
                  This value is not the same for all time periods.
                </p>
              )}
              <Button
                theme="primary"
                isLink
                styles={style.firstBtn}
                to={buildSettingsSubPath(jobSettingsPageSubpaths[propName])}
                allowTabFocus={!disabled}
              >
                <i className="fas fa-eye" /> <i className="fas fa-edit" />  View/Edit
              </Button>
            </div>
          )
        )
      }
    </ContentArea>
  );
}

export default SettingsArea;