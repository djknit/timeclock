import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';
import CurrentItemValueDisplay from './CurrentItemValue';

const settingsLabelsAndPropNamesAndPagePaths = [
  {
    label: 'Timezone',
    propName: 'timezone',
    pagePath: 'timezone'
  },
  {
    label: 'Wage',
    propName: 'wage',
    pagePath: 'wage'
  },
  {
    label: 'New Weeks Begin On:',
    propName: 'weekBegins',
    pagePath: 'week-begins'
  },
  {
    label: 'Day Cutoff',
    propName: 'dayCutoff',
    pagePath: 'day-cutoff'
  }
];

function SettingsArea({
  style,
  disabled,
  job,
  settingsSubPathRedirectorFactory
}) {

  const completeStyle = getStyle(style);

  return (
    <ContentArea style={completeStyle.contentArea}>
      <ContentAreaTitle>Settings Summary</ContentAreaTitle>
      {
        settingsLabelsAndPropNamesAndPagePaths.map(
          ({ label, propName, pagePath }, index) => (
            <div
              style={
                index === settingsLabelsAndPropNamesAndPagePaths.length - 1 ?
                completeStyle.lastAreaHasBtns :
                completeStyle.areaNotLastHasBtns
              }
              key={label}
            >
              <p style={completeStyle.areaLabel}>
                {label}
              </p>
              <CurrentItemValueDisplay
                {...{
                  propName,
                  job,
                  disabled
                }}
              />
              <Button
                theme="primary"
                styles={completeStyle.firstBtn}
                onClick={settingsSubPathRedirectorFactory(pagePath)}
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