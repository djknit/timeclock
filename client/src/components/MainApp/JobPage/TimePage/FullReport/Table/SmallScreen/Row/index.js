import React, { Component } from 'react';
import {
  // formatDurationForReportTable,
  // formatAmountEarnedForReportTable,
  // formatPayRateForReportTable,
  getWidthOfEl,
  methodsRegMgmtFactory
} from '../utilities';
import getStyle from './style';
import Times from '../../Times';
import TwoTzTimes from '../../TwoTzTimes';
import TdDropDown from '../../DropDown';
import ValuesTdContent from './ValuesTdContent';

class Row extends Component {
  constructor(props) {
    super(props);
    this.getAmountDispRightWidth = this.getAmountDispRightWidth.bind(this);
    this.amountColRightRefs = {
      duration: React.createRef(),
      payRate: React.createRef(),
      amountEarned: React.createRef()
    };
    this.state = {
    };
  };

  // getAmountDispRightWidth() { // get max width of amounts past decimal so amounts can line up at decimal point
  //   let width;
  //   for (const elRef of Object.values(this.amountColRightRefs)) {
  //     const thisElWidth = getWidthOfEl(elRef);
  //     if (thisElWidth > width) width = thisElWidth;
  //   }
  //   return width;
  // };

  render() {
    const {
      hasTimes,
      primaryTimezone,
      secondaryTimezone,
      hasSecondaryTzTimes,
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
      registerValuesDdWidthGetter,
      unregisterValuesDdWidthGetter
    } = this.props;
    const { amountColRightRefs } = this;

    const commonTimesAttrs = { dayDate: date };

    const style = getStyle(styleProp, colWidths, isFirstInGroup);
    
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
            registerDdWidthGetter={registerValuesDdWidthGetter}
            unregisterDdWidthGetter={unregisterValuesDdWidthGetter}
            valuesRightRefs={amountColRightRefs}
          />
        </td>
      </tr>
    );
  };
}

export default Row;
