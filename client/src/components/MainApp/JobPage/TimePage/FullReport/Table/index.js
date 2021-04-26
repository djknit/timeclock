import React, { Component } from 'react';
import getStyle from './style';
import Thead from './Head';
import RowsGroup from './RowsGroup';

class Table extends Component {
  constructor() {
    super();
    this.getWidths = this.getWidths.bind(this);
    this.colRefs = {
      times: React.createRef(),
      duration: React.createRef(),
      payRate: React.createRef(),
      amountEarned: React.createRef(),
      secondaryTzTimes: React.createRef(),
    };
    this.tableRef = React.createRef();
  }

  getWidths() {
    let widths = { columns: {} };
    for (const colName in this.colRefs) {
      const { current } = this.colRefs[colName];
      widths.columns[colName] = current && current.clientWidth + 2;
    }
    const { current } = this.tableRef;
    widths.table = current && current.clientWidth + 2;
    return widths;
  }

  getTableWidth() {
    
  };

  componentDidMount() {
    this.props.registerWidthsGetter(this.getWidths);
  }

  componentWillUnmount() {
    this.props.unregisterWidthsGetter(this.getWidths);
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
    } = this.props;
    const { colRefs, tableRef } = this;

    const hasSecondaryTzTimes =
      hasSecondTzTimesProp === undefined
        ? primaryTimezone !== secondaryTimezone
        : hasSecondTzTimesProp;

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
