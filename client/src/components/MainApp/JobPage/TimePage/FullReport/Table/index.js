import React, { Component } from 'react';
import getStyle, { cellXPadding } from './style';
import { getWidthOfEl, methodsRegMgmtFactory } from './utilities';
import WideScreen from './WideScreen';
import MediumScreen from './MediumScreen';
import SmallScreen from './SmallScreen';

const mainComponentsByWidthLevel = [WideScreen, MediumScreen, SmallScreen];
const numWidthLevels = mainComponentsByWidthLevel.length;
const ddWidthGettersName = 'valueDdWidthGetters';

class Table extends Component {
  constructor() {
    super();
    this.registerValuesDdWidthGetter = methodsRegMgmtFactory(ddWidthGettersName, false).bind(this);
    this.unregisterValuesDdWidthGetter = methodsRegMgmtFactory(ddWidthGettersName, true).bind(this);
    this.getColWidths = this.getColWidths.bind(this);
    this.getSimpleColWidths = this.getSimpleColWidths.bind(this);
    this.getValuesDdWidths = this.getValuesDdWidths.bind(this);
    this.colRefs = {
      times: React.createRef(),
      duration: React.createRef(),
      values: React.createRef(),
      payRate: React.createRef(),
      amountEarned: React.createRef(),
      secondaryTzTimes: React.createRef(),
    };
    this.state = {
      getValuesDdWidthsTries: 0,
      [ddWidthGettersName]: [],
      // valueColRightWidthGetters: []
    };
  };

  getColWidths() {
    // console.log('table > `getColWidths`');
    return new Promise(resolve => {
      if (this.state[ddWidthGettersName].length > 0) {
        this.getValuesDdWidths().then(dropdownWidth => {
          let colWidths = this.getSimpleColWidths();
          // console.log('colWidths: > ', colWidths)
          resolve({
            ...this.getSimpleColWidths(),
            valuesDropdown: dropdownWidth
          });
        });
      }
      else resolve(this.getSimpleColWidths());
    });
  };

  getSimpleColWidths() {
    let colWidths = {};
    for (const [colName, colCellRef] of Object.entries(this.colRefs)) {
      const measuredWidth = getWidthOfEl(colCellRef);
      colWidths[colName] = measuredWidth && measuredWidth + 2;
    }
    return colWidths;
  };

  getValuesDdWidths() {
    console.log('table > `getValuesDdWidths`');
    return new Promise(resolve => {
      let { getValuesDdWidthsTries, [ddWidthGettersName]: widthGetters } = this.state;
      if (++getValuesDdWidthsTries > 4) {
        this.setState({ getValuesDdWidthsTries: 0 });
        return resolve(null);
      }
      let numRows = 0;
      this.props.rowGroups.forEach(({ rows }) => numRows += rows.length);
      const hasAllGetters = widthGetters.length === numRows;
      if (!hasAllGetters) {
        console.log('wrong num getters')
        return this.setState({ getValuesDdWidthsTries }, this.getValuesDdWidths);
      }
      let numResponsesNeeded = numRows, width;
      widthGetters.forEach(getValuesDdWidth => {
        getValuesDdWidth()
        .then(ddWidth => {
          console.log('valueDdWidth: ', ddWidth)
          width = Math.max(ddWidth, width || 0);
          if (--numResponsesNeeded === 0) {
            this.setState({ getValuesDdWidthsTries: 0 });
            resolve(width);
          }
        });
      });
      // resolve(width);
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
    const { colRefs, registerValuesDdWidthGetter, unregisterValuesDdWidthGetter } = this;

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
            registerValuesDdWidthGetter,
            unregisterValuesDdWidthGetter
          }}
        />
      </table>
    );
  };
}

export default Table;

export { numWidthLevels };
