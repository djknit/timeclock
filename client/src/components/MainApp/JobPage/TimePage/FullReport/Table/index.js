import React, { Component } from 'react';
import getStyle from './style';
import { getWidthOfEl } from './utilities';
import WideScreen from './WideScreen';
import MediumScreen from './MediumScreen';

const mainComponentsByWidthLevel = [WideScreen, MediumScreen];

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
    for (const [colName, colCellRef] of Object.entries(this.colRefs)) {
      const measuredWidth = getWidthOfEl(colCellRef);
      colWidths[colName] = measuredWidth && measuredWidth + 2;
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
      primaryTimezone,
      secondaryTimezone,
      colWidths,
      widthLevel,
      tableRef,
      ...otherProps
    } = this.props
    const {
      hasSecondaryTzTimes = primaryTimezone !== secondaryTimezone
    } = this.props;
    const { colRefs } = this;

    const style = getStyle(styleProp, colWidths);

    const TableContent = mainComponentsByWidthLevel[widthLevel] || (() => (<></>));

    return (
      <table className="table" style={style.table} ref={tableRef}>
        <TableContent
          {...otherProps}
          {...{
            primaryTimezone,
            secondaryTimezone,
            colRefs,
            colWidths, 
            hasSecondaryTzTimes
          }}
        />
      </table>
    );
  };
}

export default Table;
