import React, { Component } from 'react';
import {
  formatDurationForReportTable,
  formatAmountEarnedForReportTable,
  formatPayRateForReportTable,
  getWidthOfEl
} from '../utilities';
import getStyle from './style';
import Times from '../../Times';
import TwoTzTimes from '../../TwoTzTimes';
import TdDropDown from '../../DropDown';

class Row extends Component {
  constructor(props) {
    super(props);
    this.getAmountDispRightWidth = this.getAmountDispRightWidth.bind(this);
    this.amountColRightRefs = {
      duration: React.createRef(),
      payRate: React.createRef(),
      amountEarned: React.createRef()
    };
  };

  getAmountDispRightWidth() { // get max width of amounts past decimal so amounts can line up at decimal point
    let width;
    for (const elRef of Object.values(this.amountColRightRefs)) {
      const thisElWidth = getWidthOfEl(elRef);
      if (thisElWidth > width) width = thisElWidth;
    }
    return width;
  };

  componentDidMount() {
    this.props.registerColWidthsGetter(this.getAmountDispRightWidth);
  };

  componentWillUnmount() {
    this.props.unregisterColWidthsGetter(this.getAmountDispRightWidth);
  };

  render() {
    const {
      hasTimes,
      primaryTimezone,
      secondaryTimezone,
      // hasSecondTzCol,
      hasSecondaryTzTimes,
      // hasEarningCols,
      rowData: {
        times: {
          sessionTimezone: sessTzTimes,
          officialTimezone: jobTzTimes
        } = {},
        rowLabel,
        duration ,
        amountEarned,
        payRate,
        // _id, // segment id; only defined for rows that represent segments; not currently needed.
        style: styleProp
      },
      isFirstInGroup,
      date,
      colWidths
    } = this.props;
    const { amountColRightRefs } = this;

    const commonTimesAttrs = { dayDate: date };
    
    const durationDisp = formatDurationForReportTable(duration, undefined, true);
    const payRateDisp = formatPayRateForReportTable(payRate, true);
    const amountEarnedDisp = formatAmountEarnedForReportTable(amountEarned, true);

    const style = getStyle(styleProp, colWidths, isFirstInGroup);
    
    const AmountValue = getAmountValComp(style.amountValueRightPart);
    
    return (
      <tr style={style.tr}>
        <td style={hasTimes ? style.timesTd : style.firstColNoTimes}>
          {(hasTimes && hasSecondaryTzTimes && (
            <TwoTzTimes
              {...{
                primaryTimezone,
                secondaryTimezone
              }}
              primaryTimezoneTimes={sessTzTimes}
              secondaryTimezoneTimes={jobTzTimes}
              {...commonTimesAttrs}
            />
          )) ||
          (hasTimes && (
            <Times {...sessTzTimes} {...commonTimesAttrs} />
          )) ||
          (rowLabel && (
            <>{rowLabel}:</>
          ))}
        </td>
        <td style={style.amountsTd}>
          <AmountValue rightRef={amountColRightRefs.duration} splitDisp={durationDisp} />
          {(payRate || amountEarned) && (
            <TdDropDown>
              <AmountValue rightRef={amountColRightRefs.payRate} splitDisp={payRateDisp} />
              {payRate && amountEarned && <br />}
              <AmountValue rightRef={amountColRightRefs.amountEarned} splitDisp={amountEarnedDisp} />
            </TdDropDown>
          )}
        </td>
      </tr>
    );
  };
}

export default Row;


function getAmountValComp(rightStyle) {
  return function AmountValue({
    rightRef,
    splitDisp,
    rightStyle
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
