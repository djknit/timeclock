import React, { Component } from 'react';
import getStyle from './style';
import { currentJobTimeService, windowWidthService } from '../../../../../data';
import { getNumTablesInReport } from './utilities';
import Week from './Week';
import Totals from './Totals';

class FullReport extends Component {
  constructor() {
    super();
    this.setStateThenWidth = this.setStateThenWidth.bind(this);
    this.registerWidthsGetters = this.registerWidthsGetters.bind(this);
    this.unregisterWidthsGetters = this.unregisterWidthsGetters.bind(this);
    this.setWidths = this.setWidths.bind(this);
    this.setTableColWidths = this.setTableColWidths.bind(this);
    this.setTableWidth = this.setTableWidth.bind(this);
    this.state = {
      allColWidths: undefined,
      widthsGetters: [],
      allTableWidth: undefined
    };
  };

  setStateThenWidth(stateUpdatesArg) {
    this.setState(stateUpdatesArg, this.setWidths);
  };

  registerWidthsGetters(gettersForTable) { // param is obj. w/ 2 methods `table` & `columns` which measure width(s) for one table
    this.setStateThenWidth(({ widthsGetters }) => ({
      widthsGetters: [...widthsGetters, gettersForTable]
    }));
  };

  unregisterWidthsGetters(tableWidthGetter) { // param is fxn. for measuring whole table only for one table (only the `table` method registered in `registerWidthsGetters`)
    this.setStateThenWidth(({ widthsGetters }) => ({
      widthsGetters: widthsGetters.filter(({ table }) => table !== tableWidthGetter)
    }));
  };

  setWidths() {
    // console.log(`setWidths`)
    if (this.state.allTableWidth || this.state.allColWidths) {
      return this.setStateThenWidth({ allTableWidth: undefined, allColWidths: undefined });
    }
    if (this.state.widthsGetters.length === getNumTablesInReport(this.props.processedTimeData)) {
      this.setTableColWidths().then(this.setTableWidth);
    };
  };

  setTableColWidths() {
    let allColWidths = {}; // (col width is set to the largest width of all tables in report, so cols are big enough for all tables and all tables have same widths)
    this.state.widthsGetters.forEach(thisTableWidthsGetters => {
      const thisTableColWidths = thisTableWidthsGetters.columns();
      for (const colName of Object.keys(thisTableColWidths)) {
        allColWidths[colName] = Math.max(allColWidths[colName] || 0, thisTableColWidths[colName]);
      }
    });
    return new Promise(resolve => this.setState({ allColWidths }, resolve));
  };

  setTableWidth() {
    let allTableWidth = 0; // same idea as `setTableColWidths`
    this.state.widthsGetters.forEach(thisTableWidthsGetters => {
      allTableWidth = Math.max(allTableWidth || 0, thisTableWidthsGetters.table());
    });
    return new Promise(resolve => this.setState({ allTableWidth }, resolve));
    this.setState({ allTableWidth });
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
    const { registerWidthsGetters, unregisterWidthsGetters } = this;
    const { processedTimeData, dateRange, style: styleProp } = this.props;
    const { allColWidths, allTableWidth } = this.state;

    console.log('allTableWidth\n', allTableWidth)
  
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
      tableColWidths: allColWidths,
      registerWidthsGetters,
      unregisterWidthsGetters
    };
  
    const style = getStyle(styleProp);
  
    return (
      <article style={style.wholeReport}>
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
          {...{ totals }}
          isReportTotals
          areaLabel={!dateRange && 'Job Totals'}
        />
      </article>
    );
  };
}

export default FullReport;
