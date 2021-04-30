import React, { Component } from 'react';
import getStyle, { tableAreaStyleVars } from './style';
import { currentJobTimeService, windowWidthService } from '../../../../../data';
import { getNumTablesInReport, getWidthOfEl } from './utilities';
import Week from './Week';
import Totals from './Totals';

const { pxWidthUnavailableToTables } = tableAreaStyleVars;

class FullReport extends Component {
  constructor() {
    super();
    this.setStateThenWidth = this.setStateThenWidth.bind(this);
    this.registerColWidthsGetter = this.registerColWidthsGetter.bind(this);
    this.unregisterColWidthsGetter = this.unregisterColWidthsGetter.bind(this);
    this.setWidths = this.setWidths.bind(this);
    this.setTableColWidths = this.setTableColWidths.bind(this);
    this.ensureTableFits = this.ensureTableFits.bind(this);
    this.resetWidths = this.resetWidths.bind(this);
    this.tableRef = React.createRef();
    this.wholeReportRef = React.createRef();
    this.state = {
      colWidths: undefined,
      colWidthsGetters: [],
      otherWidths: undefined,
      isSettingWidths: false,
      tableWidthLevel: 0
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
    if (state.colWidthsGetters.length !== getNumTablesInReport(props.processedTimeData)) return;
    if (state.colWidths || state.otherWidths || !state.isSettingWidths) {
      return this.setStateThenWidth({ colWidths: undefined, otherWidths: undefined, isSettingWidths: true });
    }
    this.setTableColWidths().then(this.ensureTableFits);
  };

  setTableColWidths() { // (col width is set to the largest width needed by any table so all tables can have same widths)
    let colWidths = {};
    this.state.colWidthsGetters.forEach(getTableColWidths => {
      for (const [colName, colWidth] of Object.entries(getTableColWidths())) {
        colWidths[colName] = Math.max(colWidths[colName] || 0, colWidth);
      }
    });
    return new Promise(resolve => this.setState({ colWidths }, resolve));
  };

  ensureTableFits() {
    const availableWidth = getWidthOfEl(this.wholeReportRef) - pxWidthUnavailableToTables - 3;
    if (getWidthOfEl(this.tableRef) > availableWidth) {
      return this.setStateThenWidth({ tableWidthLevel: this.state.tableWidthLevel + 1 });
    }
    this.setState({ isSettingWidths: false });
  };

  resetWidths() {
    return this.setStateThenWidth({ tableWidthLevel: 0 });
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
    const {
      processedTimeData, dateRange, style: styleProp
    } = this.props;
    const { colWidths, isSettingWidths, tableWidthLevel } = this.state;

    if (!processedTimeData) {
      return (<></>);
    }
  
    const {
      weeks,
      totals,
      hasPaidTime: reportHasPaidTime,
      hasMultipleTimezones: reportHasMultipleTimezones,
      ...otherTimeData
    } = processedTimeData;

    const commonTablesAttrs = {
      ...otherTimeData,
      reportHasMultipleTimezones,
      reportHasPaidTime,
      tableColWidths: colWidths, 
      registerColWidthsGetter,
      unregisterColWidthsGetter,
      tableWidthLevel
    };
  
    const style = getStyle(styleProp, isSettingWidths);
  
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
