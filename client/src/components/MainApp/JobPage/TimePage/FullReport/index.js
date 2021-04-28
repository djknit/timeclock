import React, { Component } from 'react';
import getStyle, { tableAreaStyleVars } from './style';
import { currentJobTimeService, windowWidthService } from '../../../../../data';
import { getNumTablesInReport, getWidthOfEl, promiseToSetState } from './utilities';
import Week from './Week';
import Totals from './Totals';

const { tableLeftPxMargin, tableRightPxMargin, bLevelAreaLeftPxPadding } = tableAreaStyleVars;

const pxWidthUnavailableToTables = tableLeftPxMargin + tableRightPxMargin + bLevelAreaLeftPxPadding;

const preWidthSetUpdaters = {
  registerColWidthsGetter: (prevState, getColWidthsForTable) => ({
    colWidthsGetters: [...prevState.colWidthsGetters, getColWidthsForTable]
  }),
  unregisterColWidthsGetter: ({ colWidthsGetters }, getColWidthsForTable) => ({
    colWidthsGetters: colWidthsGetters.filter(fxn => fxn !== getColWidthsForTable)
  }),
  clearWidths: () => ({ colWidths: undefined, otherWidths: undefined }),
  resetWidths: () => ({ tableWidthLevelIndex: 0 }),
  tryNextTableWidthLevel: prevState => ({
    tableWidthLevelIndex: prevState.tableWidthLevelIndex + 1
  })
};

class FullReport extends Component {
  constructor() {
    super();
    this.setStateThenWidthFactory = this.setStateThenWidthFactory.bind(this);
    for (const [methodName, updater] of Object.entries(preWidthSetUpdaters)) {
      this[methodName] = this.setStateThenWidthFactory(updater).bind(this);
    };
    this.setWidths = this.setWidths.bind(this);
    this.setTableColWidths = this.setTableColWidths.bind(this);
    // this.setOtherWidths = this.setOtherWidths.bind(this);
    this.ensureTableWidthFits = this.ensureTableWidthFits.bind(this);
    this.tableRef = React.createRef();
    this.wholeReportRef = React.createRef();
    this.state = {
      colWidths: undefined,
      colWidthsGetters: [],
      areWidthsSet: false,
      tableWidthLevelIndex: 0 // which table component is needed for screen size (0 is largest, then 1, etc.)
    };
  };

  setStateThenWidthFactory(transformHasExtraParams) {
    return function (...args) {
      const stateTransformOnly = prevState => transformHasExtraParams(prevState, ...args);
      return promiseToSetState(this, stateTransformOnly).then(this.setWidths);
    };
  };

  setWidths() {
    const { props, state } = this;
    if (state.colWidths || state.otherWidths) return this.clearWidths();
    if (state.colWidthsGetters.length === getNumTablesInReport(props.processedTimeData)) {
      return this.setTableColWidths().then(this.ensureTableWidthFits);
    };
  };

  setTableColWidths() { // (col width is set to the largest width needed by any table so all tables can have same widths)
    let colWidths = {};
    this.state.colWidthsGetters.forEach(getTableColWidths => {
      for (const [colName, colWidth] of Object.entries(getTableColWidths())) {
        colWidths[colName] = Math.max(colWidths[colName] || 0, colWidth);
      }
    });
    console.log('SET TABLE COL WIDTHS')
    console.log('colWidths\n', colWidths)
    return promiseToSetState(this, { colWidths });
  };

  // setOtherWidths() {
  //   let otherWidths = {
  //     table: getWidthOfEl(this.tableRef) + 1,
  //     wholeReport: getWidthOfEl(this.wholeReportRef) - 2
  //   };
  //   otherWidths.extra = otherWidths.wholeReport - pxWidthUnavailableToTables - otherWidths.table;
  //   return promiseToSetState(this, { otherWidths });
  // };

  ensureTableWidthFits() {
    if (getWidthOfEl(this.tableRef) + pxWidthUnavailableToTables > getWidthOfEl(this.wholeReportRef) - 3) {
      return this.tryNextTableWidthLevel();
    }
    return promiseToSetState(this, { areWidthsSet: true });
  };

  componentDidMount() {
    currentJobTimeService.subscribe(this.setWidths);
    windowWidthService.subscribe(this.resetWidths);
  };

  componentWillUnmount() {
    currentJobTimeService.unsub(this.setWidths);
    windowWidthService.unsub(this.resetWidths);
  };

  render() {
    const {
      registerColWidthsGetter, unregisterColWidthsGetter, wholeReportRef, tableRef
    } = this;
    const { processedTimeData, dateRange, style: styleProp } = this.props;
    const { colWidths, tableWidth, areWidthsSet } = this.state;

    console.log('tableWidth\n', tableWidth)
  
    if (!processedTimeData) {
      return (<></>);
    }
  
    const {
      weeks,
      totals,
      hasPaidTime: reportHasPaidTime,
      hasMultipleTimezones: reportHasMultipleTimezones
    } = processedTimeData;

    const commonTablesAttrs = {
      reportHasPaidTime,
      reportHasMultipleTimezones,
      tableColWidths: colWidths,
      registerColWidthsGetter,
      unregisterColWidthsGetter
    };
  
    const style = getStyle(styleProp, areWidthsSet);
  
    return (
      <article style={style.wholeReport} ref={wholeReportRef}>
        <h1 style={style.reportTitle} className="title is-size-4">
          Full Report of All Time
        </h1>
        {weeks.map(week => (
          <Week
            key={week.weekDocId}
            {...commonTablesAttrs}
            {...{ week }}
          />
        ))}
        <Totals
          {...commonTablesAttrs}
          {...{
            totals,
            tableRef
          }}
          isReportTotals
          areaLabel={!dateRange && 'Job Totals'}
        />
      </article>
    );
  };
}

export default FullReport;
