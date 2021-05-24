import React, { Component } from 'react';
import {
  formatDurationForReportTable, formatPayRateForReportTable, formatAmountEarnedForReportTable
} from '../../utilities';
import TdDropDown from '../../../DropDown';

class ValuesTdContent extends Component {
  constructor(props) {
    super(props);
    this.getDdContainerWidth = this.getDdContainerWidth.bind(this);
    this.registerDdWidthGetter = this.registerDdWidthGetter.bind(this);
    this.state = {
      getWidthTries: 0,
      getDdWidthFromChild: undefined
    };
  };

  getDdContainerWidth() {
    return new Promise(resolve => {
      if (!this.props.payRate && !this.props.amountEarned) return resolve();
      let { getWidthTries, getDdWidthFromChild } = this.state;
      if (++getWidthTries > 4) {
        return this.setState({ getWidthTries: 0 }, resolve);
      }
      if (!getDdWidthFromChild) {
        return this.setState({ getWidthTries }, this.getDdContainerWidth);
      }
      getDdWidthFromChild().then(dropdownWidth => {
        this.setState({ getWidthTries: 0 });
        resolve(dropdownWidth);
      });
    });
  };

  registerDdWidthGetter(getDdWidth) {
    this.setState({ getDdWidthFromChild: getDdWidth });
  };
  
  componentDidMount() {
    if (!this.props.registerDdWidthGetter) return;
    this.props.registerDdWidthGetter(this.getDdContainerWidth);
  };

  componentWillUnmount() {
    if (!this.props.unregisterDdWidthGetter) return;
    this.props.unregisterDdWidthGetter(this.getDdContainerWidth);
  };

  render() {
    const {
      valueRightStyle,
      valuesRightRefs,
      duration,
      payRate,
      amountEarned,
      ...otherProps
    } = this.props;
    const { registerDdWidthGetter } = this;

    const hasPayRateAndAmount = !!(payRate && amountEarned);

    const durationDisp = formatDurationForReportTable(duration, undefined, true);
    const payRateDisp = formatPayRateForReportTable(payRate, true, hasPayRateAndAmount);
    const amountEarnedDisp = formatAmountEarnedForReportTable(amountEarned, true, hasPayRateAndAmount);

    const AmountValue = getAmountValComp(valueRightStyle);

    return (
      <>
        <AmountValue rightRef={valuesRightRefs.duration} splitDisp={durationDisp} />
        {(payRate || amountEarned) && (
          <TdDropDown registerWidthGetter={registerDdWidthGetter} {...otherProps}>
            <AmountValue rightRef={valuesRightRefs.payRate} splitDisp={payRateDisp} />
            {payRate && amountEarned && <br />}
            <AmountValue rightRef={valuesRightRefs.amountEarned} splitDisp={amountEarnedDisp} />
          </TdDropDown>
        )}
      </>
    );
  };
}

export default ValuesTdContent;


function getAmountValComp(rightStyle) {
  return function AmountValue({
    rightRef,
    splitDisp
  }) {
    return splitDisp ? (
      <>
        {
          splitDisp[0]
        }.{
          <span ref={rightRef} style={rightStyle} children={splitDisp[1]} />
        }
      </>
    ) : (
      null
    );
  };
}
