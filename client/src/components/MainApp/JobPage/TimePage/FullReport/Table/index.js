import React, { Component } from 'react';
import getStyle from './style';
import { getWidthOfEl } from './utilities';
import Thead from './Head';
import RowsGroup from './RowsGroup';

class Table extends Component {
  constructor() {
    super();
    this.getColWidths = this.getColWidths.bind(this);
    this.colRefs = {
      times: React.createRef(),
      duration: React.createRef(),
      payRate: React.createRef(),
      amountEarned: React.createRef(),
      secondaryTzTimes: React.createRef(),
    };
  }

  getColWidths() {
    let colWidths = {};
    for (const colName in this.colRefs) {
      colWidths[colName] = getWidthOfEl(this.colRefs[colName]) + 2;
    }
    return colWidths;
  };

  componentDidMount() {
    this.props.registerColWidthsGetter(this.getColWidths);
  }

  componentWillUnmount() {
    this.props.unregisterColWidthsGetter(this.getColWidths);
  }

  render() {
    const {
      rowGroups,
      hasTimes,
      hasSecondTzCol,
      hasEarningCols,
      date,
      style: styleProp,
      hasSecondaryTzTimes: hasSecondTzTimesProp,
      primaryTimezone,
      secondaryTimezone,
      colWidths,
      tableRef
    } = this.props;
    const { colRefs } = this;

    const hasSecondaryTzTimes = (
      hasSecondTzTimesProp === undefined ?
      primaryTimezone !== secondaryTimezone :
      hasSecondTzTimesProp
    );

    const commonAttrs = {
      date,
      hasEarningCols,
      hasSecondTzCol,
      colWidths,
    };

    const style = getStyle(styleProp, colWidths);

    return (
      <table className="table" style={style.table} ref={tableRef}>
        <Thead
          {...{
            ...commonAttrs,
            hasTimes,
            primaryTimezone,
            secondaryTimezone,
            hasSecondaryTzTimes,
            colRefs,
          }}
        />
        <tbody>
          {rowGroups.map(
            ({ rows, hasTimes: groupHasTimes = hasTimes }, index) => (
              <RowsGroup
                key={index}
                {...commonAttrs}
                {...{ rows }}
                hasTimes={groupHasTimes}
                hasSecondaryTzTimes={groupHasTimes && hasSecondaryTzTimes}
              />
            )
          )}
        </tbody>
      </table>
    );
  }
}

export default Table;
