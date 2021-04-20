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
      disabled,
      labelStyle,
      hasP,
      pStyle: pStyleProp,
      label,
      detailsMarginTop,
      shouldTrackWidth // only applies to wage
    } = this.props;
    const { width } = this.state;

    const pStyle = Object.assign({}, pStyleProp, width && { width });
    const isWage = settingName === 'wage';

    // const setWidth = _width => this.setState({ width: _width });

    const style = getStyle(labelStyle);

    function P({ children }) {
      return hasP ? (
        <p style={pStyle || {}}>
          {children}
        </p>
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
            P,
            pStyle,
            hasP,
            label,
            detailsMarginTop,
            shouldTrackWidth
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
