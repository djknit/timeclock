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
import ValuesTdContent from './ValuesTdContent';

class Row extends Component {
  constructor(props) {
    super(props);
    // this.getValueColWidth = this.getValueColWidth.bind(this);
    this.getAmountDispRightWidth = this.getAmountDispRightWidth.bind(this);
    this.amountColRightRefs = {
      duration: React.createRef(),
      payRate: React.createRef(),
      amountEarned: React.createRef()
    };
  };

  // getValueColWidth() {
    
  // }

  getAmountDispRightWidth() { // get max width of amounts past decimal so amounts can line up at decimal point
    let width;
    for (const elRef of Object.values(this.amountColRightRefs)) {
      const thisElWidth = getWidthOfEl(elRef);
      if (thisElWidth > width) width = thisElWidth;
    }
    return width;
  };

  componentDidMount() {
    // this.props.registerValueColWidthGetter(this.getValueColWidth);
    // register amountDispRightWidth getter (when this feature is implemented)
  };

  componentWillUnmount() {
    // this.props.unregisterValueColWidthGetter(this.getValueColWidth);
    // unregister amountDispRightWidth getter (when this feature is implemented)
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
      colWidths,
      registerValueColWidthGetter,
      unregisterValueColWidthGetter
    } = this.props;
    const { amountColRightRefs } = this;
    // console.log('colWidths: ', colWidths)

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
          <ValuesTdContent
            {...{
              duration,
              payRate,
              amountEarned
            }}
            registerDdWidthGetter={registerValueColWidthGetter}
            unregisterDdWidthGetter={unregisterValueColWidthGetter}
            valuesRightRefs={amountColRightRefs}
          />
        </td>
      </tr>
    );
  };
}

export default Row;


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
