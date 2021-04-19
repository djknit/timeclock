import React, { Component } from 'react';
import { getSimpleJobSettingValueText } from '../utilities';
import getStyle from './style';
import Wage from './Wage';

class SettingValueDisplay extends Component {
  constructor(props) {
    super(props);
    this.setWidth = this.setWidth.bind(this);
    this.state = {
      width: undefined
    };
  };

  setWidth(width) {
    this.setState({ width });
  };

  render() {
    const { setWidth } = this;
    const {
      settingName,
      value,
      disabled,
      labelStyle,
      hasP,
      pStyle,
      label,
      detailsMarginTop,
      shouldTrackWidth // only applies to wage
    } = this.props;
    const { width } = this.state;

    if (width && pStyle) {
      pStyle.width = width;
    }

    const isWage = settingName === 'wage'

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
            setWidth,
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
