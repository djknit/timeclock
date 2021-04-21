import React, { Component } from 'react';
import { getSimpleJobSettingValueText } from '../utilities';
import getStyle from './style';
import Wage from './Wage';

class SettingValueDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: undefined
    };
  };

  render() {
    const {
      settingName,
      value,
      label,
      labelStyle,
      disabled,
      hasP,
      pStyle,
      detailsMarginTop = '0.4em'
    } = this.props;

    const isWage = settingName === 'wage';

    const style = getStyle(labelStyle);

    function P({ children }) {
      return (
        hasP ?
        (<p style={pStyle} {...{ children }} />) :
        children
      );
    }

    return (
      (isWage && value) ? (
        <Wage
          {...{
            value,
            label,
            disabled,
            hasP,
            pStyle,
            detailsMarginTop
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
  };
};

export default SettingValueDisplay;

/* NOTE: parent must have relative postition for wage dropdown to work properly */
