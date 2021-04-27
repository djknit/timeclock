import React, { Component } from 'react';
import getStyle from './style';
import Thead from './Head';
import RowsGroup from './RowsGroup';

const getElWidth = ({ current }) => current && current.clientWidth + 2;

class Table extends Component {
  constructor() {
    super();
    this.getColWidths = this.getColWidths.bind(this);
    this.getTableWidth = this.getTableWidth.bind(this);
    this.colRefs = {
      times: React.createRef(),
      duration: React.createRef(),
      payRate: React.createRef(),
      amountEarned: React.createRef(),
      secondaryTzTimes: React.createRef(),
    };
    this.tableRef = React.createRef();
  }

  getColWidths() {
    let colWidths = {};
    for (const colName in this.colRefs) {
      colWidths[colName] = getElWidth(this.colRefs[colName]);
    }
    return colWidths;
  };

  getTableWidth() {
    return getElWidth(this.tableRef);
  };

  componentDidMount() {
    this.props.registerWidthsGetters({ columns: this.getColWidths, table: this.getTableWidth });
  }

  componentWillUnmount() {
    this.props.unregisterWidthsGetters(this.getTableWidth);
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
