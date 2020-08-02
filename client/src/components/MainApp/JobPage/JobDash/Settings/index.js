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
  job
}) {

  const completeStyle = getStyle(style);

  return (
    <ContentArea style={completeStyle.contentArea}>
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
              onClick={() => {}}
              allowTabFocus={!disabled}
            >
              <i className="fas fa-eye" /> <i className="fas fa-edit" />  View/Edit
            </Button>
          </div>
        )
      )}
    </ContentArea>
  );
}

export default SettingsArea;