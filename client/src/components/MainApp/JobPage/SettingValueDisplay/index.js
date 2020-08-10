import React from 'react';
import { getSimpleJobSettingValueText } from '../utilities';
import getStyle from './style';
import Wage from './Wage';

function SettingValueDisplay({
  settingName,
  value,
  disabled,
  labelStyle,
  hasP,
  pStyle,
  label
}) {

  const isWage = settingName === 'wage'

  const style = getStyle(labelStyle);

  function P({ children }) {
    return hasP ? (
      <p style={pStyle || {}}>{children}</p>
    ) : (
      children
    );
  }

  return (
    (isWage && value) ? (
      <Wage
        value={value}
        {...{
          disabled,
          hasP,
          pStyle,
          label
        }}
      />
    ) : (
      <P>
        {label && (
          <>
            <strong style={style.valueLabel}>
              {label}:
            </strong>
            &ensp;
          </>
        )}
        {isWage ? 'none' : getSimpleJobSettingValueText(settingName, value)}
      </P>
    )
  );
}

export default SettingValueDisplay;