import React, { Component } from 'react';
// import getStyle from './style';
import Thead from '../Head';
import RowsGroup from '../RowsGroup';
import Row from './Row';

class SmallWidthTableContent extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const {
      rowGroups,
      hasTimes,
      hasSecondaryTzTimes,
      colRefs,
      amountColRightRefs,
      ...otherProps
    } = this.props;
    
    const commonAttrs = {
      ...otherProps,
      hasSecondTzCol: false
    };
  
    const primaryTzLabel = hasTimes && hasSecondaryTzTimes && 'Times';
    // const style = getStyle(styleProp, colWidths);
  
    return (
      <>
        <Thead
          {...{
            ...commonAttrs,
            hasTimes,
            hasSecondaryTzTimes,
            colRefs,
            primaryTzLabel
          }}
          isTwoCol
          hasEarningCols={false}
        />
        <tbody>
          {rowGroups.map(
            ({ rows, hasTimes: groupHasTimes = hasTimes }, index) => (
              <RowsGroup
                key={index}
                {...commonAttrs}
                {...{ rows }}
                RowComponent={Row}
                hasTimes={groupHasTimes}
                hasSecondaryTzTimes={groupHasTimes && hasSecondaryTzTimes}
              />
            )
          )}
        </tbody>
      </>
    );
  };
}

export default SmallWidthTableContent;
