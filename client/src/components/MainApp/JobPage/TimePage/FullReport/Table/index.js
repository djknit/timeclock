import React, { Component } from 'react';
import getStyle from './style';
import { getWidthOfEl } from './utilities';
import WideScreen from './WideScreen';
import MediumScreen from './MediumScreen';
import SmallScreen from './SmallScreen';

const mainComponentsByWidthLevel = [WideScreen, MediumScreen, SmallScreen];
const numWidthLevels = mainComponentsByWidthLevel.length;

class Table extends Component {
  constructor() {
    super();
    this.getColWidths = this.getColWidths.bind(this);
    this.getAmountsColRightWidth = this.getAmountsColRightWidth.bind(this);
    this.colRefs = {
      times: React.createRef(),
      duration: React.createRef(),
      payRate: React.createRef(),
      amountEarned: React.createRef(),
      secondaryTzTimes: React.createRef(),
    };
    this.state = {
      getAmountWidthTries: 0,
      amountsColRightWidthGetters: []
    };
  };

  getColWidths() {
    let colWidths = {};
    for (const [colName, colCellRef] of Object.entries(this.colRefs)) {
      const measuredWidth = getWidthOfEl(colCellRef);
      colWidths[colName] = measuredWidth && measuredWidth + 2;
    }
    return colWidths;
  };

  getAmountsColRightWidth() {
    let numRows = 0;
    this.props.rowGroups.forEach(({ rows }) => numRows += rows.length);
    let { getAmountWidthTries } = this.state;
    if (++getAmountWidthTries > 5) {
      this.setState({ getAmountWidthTries: 0 });
      return null;
    }
    const hasGetters = this.state.amountsColRightWidthGetters.length === numRows;
    const hasAnyWidthsSet = this.props.colWidths || this.props.amountDispRightWidth;
    if (hasAnyWidthsSet || !hasGetters) {
      return this.setState({ getAmountWidthTries }, );
    }
    let width;
    this.state.amountsColRightWidthGetters.forEach(getAmountRightWidth => {
      width = Math.max(getAmountRightWidth(), width || 0);
    });
  };

  componentDidMount() {
    this.props.registerColWidthsGetter(this.getColWidths);
  };

  componentWillUnmount() {
    this.props.unregisterColWidthsGetter(this.getColWidths);
  };

  render() {
    const { 
      style: styleProp,
      primaryTimezone,
      secondaryTimezone,
      tableWidth,
      widthLevel,
      tableRef,
      ...otherProps
    } = this.props
    const {
      hasSecondaryTzTimes = primaryTimezone !== secondaryTimezone
    } = this.props;
    const { colRefs } = this;

    const style = getStyle(styleProp, tableWidth);

    const TableContent = mainComponentsByWidthLevel[widthLevel];

    return TableContent && (
      <table className="table" style={style.table} ref={tableRef}>
        <TableContent
          {...otherProps}
          {...{
            primaryTimezone,
            secondaryTimezone,
            colRefs,
            hasSecondaryTzTimes,
          }}
        />
      </table>
    );
  };
}

export default Table;

export { numWidthLevels };
