import React, { Component } from 'react';
import getStyle from './style';
import { getWidthOfEl, methodsRegMgmtFactory } from './utilities';
import WideScreen from './WideScreen';
import MediumScreen from './MediumScreen';
import SmallScreen from './SmallScreen';

const mainComponentsByWidthLevel = [WideScreen, MediumScreen, SmallScreen];
const numWidthLevels = mainComponentsByWidthLevel.length;

class Table extends Component {
  constructor() {
    super();
    this.registerValueColWidthGetter = methodsRegMgmtFactory('valueDdWidthGetters', false).bind(this);
    this.unregisterValueColWidthGetter = methodsRegMgmtFactory('valueDdWidthGetters', true).bind(this);
    this.getColWidths = this.getColWidths.bind(this);
    this.getSimpleColWidths = this.getSimpleColWidths.bind(this);
    this.getValueDdWidths = this.getValueDdWidths.bind(this);
    this.colRefs = {
      times: React.createRef(),
      duration: React.createRef(),
      values: React.createRef(),
      payRate: React.createRef(),
      amountEarned: React.createRef(),
      secondaryTzTimes: React.createRef(),
    };
    this.state = {
      getValueDdWidthsTries: 0,
      valueDdWidthGetters: [],
      // valueColRightWidthGetters: []
    };
  };

  getColWidths() {
    return new Promise(resolve => {
      if (this.state.valueDdWidthGetters.length > 0) {
        this.getValueDdWidths().then(dropdownWidth => {
          resolve({
            ...this.getSimpleColWidths(),
            values: dropdownWidth
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

  getValueDdWidths() {
    console.log('table > `getValueDdWidths`');
    return new Promise(resolve => {
      const { props, state } = this;
      let { getValueDdWidthsTries } = state;
      if (++getValueDdWidthsTries > 5) {
        this.setState({ getValueDdWidthsTries: 0 });
        return resolve(null);
      }
      let numRows = 0;
      props.rowGroups.forEach(({ rows }) => numRows += rows.length);
      const hasAllGetters = state.valueDdWidthGetters.length === numRows;
      console.log('small screen table > has getters: ', hasAllGetters)
      if (!hasAllGetters) {
        return this.setState({ getValueDdWidthsTries }, this.getValueDdWidths);
      }
      let width;
      state.valueDdWidthGetters.forEach(getValueDdWidth => {
        width = Math.max(getValueDdWidth(), width || 0);
      });
      resolve(width);
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
    const { colRefs, registerValueColWidthGetter, unregisterValueColWidthGetter } = this;

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
            registerValueColWidthGetter,
            unregisterValueColWidthGetter
          }}
        />
      </table>
    );
  };
}

export default Table;

export { numWidthLevels };
