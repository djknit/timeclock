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
      widthLevel // which component is needed for screen size (0 is largest, then 1, etc.)
    } = this.props
    const { tableRef, colRefs } = this;

    const hasSecondaryTzTimes = (
      hasSecondTzTimesProp === undefined ?
      primaryTimezone !== secondaryTimezone :
      hasSecondTzTimesProp
    );

    const commonAttrs = {
      ...this.props,
      colRefs,
      hasSecondaryTzTimes
    };

    const style = getStyle(styleProp, colWidths);

    return (
      <table className="table" style={style.table} ref={tableRef}>
        {widthLevel === 0 && (
          <WideScreen {...commonAttrs} />
        ) || widthLevel === 1 && (
          <MediumScreen {...commonAttrs} />
        ) || (
          <></>
          )}
        <TableContent
          {...this.props}
          {...{
            colRefs, 
            hasSecondaryTzTimes
          }}
        />
      </table>
    );
  };
}

export default Table;


function TableContent({ widthLevel, ...props }) {
  const MainContentComponent = mainComponentsByWidthLevel[widthLevel];
  return (
    <MainContentComponent {...props} />
  );
}
{ }