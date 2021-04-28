import React, { Component } from 'react';
import getStyle from './style';
import { getWidthOfEl } from './utilities';
import WidesSreen from './WideScreen';

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
      style: styleProp,
      hasSecondaryTzTimes: hasSecondTzTimesProp,
      primaryTimezone,
      secondaryTimezone,
      colWidths,
      widthLevelIndex // which component is needed for screen size (0 is largest, then 1, etc.)
    } = this.props
    const { tableRef, colRefs } = this;

    const hasSecondaryTzTimes = (
      hasSecondTzTimesProp === undefined ?
      primaryTimezone !== secondaryTimezone :
      hasSecondTzTimesProp
    );

    const style = getStyle(styleProp, colWidths);

    return (
      <table className="table" style={style.table} ref={tableRef}>
        <WidesSreen
          {...this.props}
          {...{
            colRefs,
            hasSecondaryTzTimes
          }}
        />
      </table>
    );
  }
}

export default Table;
