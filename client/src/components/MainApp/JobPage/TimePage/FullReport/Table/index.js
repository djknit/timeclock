import React, { Component } from 'react';
import getStyle from './style';
import Thead from './Head';
import RowsGroup from './RowsGroup';

class Table extends Component {
  constructor() {
    super();
    this.getColumnWidths = this.getColumnWidths.bind(this);
    this.colRefs = {
      times: React.createRef(),
      duration: React.createRef(),
      payRate: React.createRef(),
      amountEarned: React.createRef(),
      secondaryTzTimes: React.createRef()
    };
  };

  getColumnWidths() {
    let colWidths = {};
    for (const colName in this.colRefs) {
      const { current } = this.colRefs[colName];
      colWidths[colName] = current && (current.clientWidth + 1);
    }
    return colWidths;
  };

  componentDidMount() {
    this.props.registerColWidthsGetter(this.getColumnWidths);
  };

  componentWillUnmount() {
    this.props.unregisterColWidthsGetter(this.getColumnWidths);
  };

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
      colWidths
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
      colWidths
    };
  
    const style = getStyle(styleProp, colWidths);
  
    return (
      <table className="table" style={style.table}>
        <Thead
          {...{
            ...commonAttrs,
            hasTimes,
            primaryTimezone,
            secondaryTimezone,
            hasSecondaryTzTimes,
            colRefs
          }}
        />
        <tbody>
          {rowGroups.map((
            { rows, hasTimes: groupHasTimes = hasTimes },
            index
          ) => (
            <RowsGroup
              key={index}
              {...commonAttrs}
              {...{ rows }}
              hasTimes={groupHasTimes}
              hasSecondaryTzTimes={groupHasTimes && hasSecondaryTzTimes}
            />
          ))}
        </tbody>
      </table>
    );
  };
}

export default Table;
