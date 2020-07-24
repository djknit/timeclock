import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';
import CurrentItemValueDisplay from './CurrentItemValue';

const settingsLabelsAndPropNames = [
  {
    label: 'Timezone',
    propName: 'timezone'
  },
  {
    label: 'Wage',
    propName: 'wage'
  },
  {
    label: 'New Weeks Begin On:',
    propName: 'weekBegins'
  },
  {
    label: 'Day Cutoff',
    propName: 'dayCutoff'
  }
];

function SettingsArea({
  style,
  disabled,
  job,
  areaRef
}) {

  console.log(job)

  const completeStyle = getStyle(style);

  return (
    <ContentArea style={completeStyle.contentArea} {...{ areaRef }}>
      <ContentAreaTitle>Settings Summary</ContentAreaTitle>
      {
        settingsLabelsAndPropNames
        .map(({ label, propName }, index) => (
          <div
            style={
              index === settingsLabelsAndPropNames.length - 1 ?
              completeStyle.lastAreaHasBtns :
              completeStyle.areaNotLastHasBtns
            }
            key={label}
          >
            <p style={completeStyle.areaLabel}>
              {label}
            </p>
            <p style={completeStyle.areaHasBtnsText}>
              <strong style={completeStyle.valueLabel}>
                Current Value:
              </strong>
              &ensp;
              <CurrentItemValueDisplay
                {...{ propName }}
                valueSchedule={job[propName]}
              />
            </p>
          </div>
        )
      )}
    </ContentArea>
  );
}

export default SettingsArea;