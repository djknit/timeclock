import React, { Component } from 'react';
import getStyle, { tableAreaStyleVars } from './style';
import { currentJobTimeService, windowWidthService } from '../../../../../data';
import { getNumTablesInReport, getWidthOfEl } from './utilities';
import Week from './Week';
import Totals from './Totals';

const { tableLeftPxMargin, tableRightPxMargin, bLevelAreaLeftPxPadding } = tableAreaStyleVars;

const pxWidthUnavailableToTables = tableLeftPxMargin + tableRightPxMargin + bLevelAreaLeftPxPadding;

class FullReport extends Component {
  constructor() {
    super();
    this.setStateThenWidth = this.setStateThenWidth.bind(this);
    this.registerColWidthsGetter = this.registerColWidthsGetter.bind(this);
    this.unregisterColWidthsGetter = this.unregisterColWidthsGetter.bind(this);
    this.setWidths = this.setWidths.bind(this);
    this.setTableColWidths = this.setTableColWidths.bind(this);
    this.setWidthAvailable = this.setWidthAvailable.bind(this);
    this.tableRef = React.createRef();
    this.wholeReportRef = React.createRef();
    this.state = {
      colWidths: undefined,
      colWidthsGetters: [],
      tableWidth: undefined,
      wholeReportWidth: undefined,
      extraWidth: undefined
    };
  };

  setStateThenWidth(stateUpdatesArg) {
    this.setState(stateUpdatesArg, this.setWidths);
  };

  registerColWidthsGetter(getColWidthsForTable) {
    this.setStateThenWidth(({ colWidthsGetters }) => ({
      colWidthsGetters: [...colWidthsGetters, getColWidthsForTable]
    }));
  };

  unregisterColWidthsGetter(getColWidthsForTable) {
    this.setStateThenWidth(({ colWidthsGetters }) => ({
      colWidthsGetters: colWidthsGetters.filter(fxn => fxn !== getColWidthsForTable)
    }));
  };

  setWidths() {
    const { props, state } = this;
    if (state.tableWidth || state.colWidths || state.wholeReportWidth) {
      return this.setStateThenWidth({ tableWidth: undefined, colWidths: undefined, wholeReportWidth: undefined });
    }
    if (state.colWidthsGetters.length === getNumTablesInReport(props.processedTimeData)) {
      this.setTableColWidths().then(this.setTableWidth).then(this.setWidthAvailable);
    };
  };

  setTableColWidths() { // (col width is set to the largest width needed by any table so all tables can have same widths)
    let colWidths = {};
    this.state.colWidthsGetters.forEach(getTableColWidths => {
      const tableColWidths = getTableColWidths()
      for (const [colName, colWidth] of Object.entries(tableColWidths)) {
        colWidths[colName] = Math.max(colWidths[colName] || 0, colWidth);
      }
    });
    return new Promise(resolve => this.setState({ colWidths }, resolve));
  };

  setWidthAvailable() {
    // how wide is space for table to fit in?
      // need wholeReport width minus any padding or table margin
    const tableWidth = getWidthOfEl(this.tableRef) + 1;
    const wholeReportWidth = getWidthOfEl(this.wholeReportRef) - 2;
    const extraWidth = wholeReportWidth - tableWidth - pxWidthUnavailableToTables;
    return new Promise(resolve => this.setState({ tableWidth, wholeReportWidth, extraWidth }, resolve));
  };

  componentDidMount() {
    currentJobTimeService.subscribe(this.setWidths);
    windowWidthService.subscribe(this.setWidths);
  };

  componentWillUnmount() {
    currentJobTimeService.unsub(this.setWidths);
    windowWidthService.unsub(this.setWidths);
  };

  render() {
    const {
      registerColWidthsGetter, unregisterColWidthsGetter, wholeReportRef, tableRef
    } = this;
    const { processedTimeData, dateRange, style: styleProp } = this.props;
    const { colWidths, tableWidth } = this.state;

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
  
    const style = getStyle(styleProp);
  
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
