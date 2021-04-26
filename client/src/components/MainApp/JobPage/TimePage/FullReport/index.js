import React, { Component } from 'react';
import getStyle from './style';
import { currentJobTimeService, windowWidthService } from '../../../../../data';
import { getNumTablesInReport } from './utilities';
import Week from './Week';
import Totals from './Totals';

class FullReport extends Component {
  constructor() {
    super();
    this.registerWidthsGetter = this.registerWidthsGetter.bind(this);
    this.unregisterWidthsGetter = this.unregisterWidthsGetter.bind(this);
    this.setTableWidths = this.setTableWidths.bind(this);
    this.state = {
      tableColWidths: undefined,
      widthsGetters: [],
      tableWidth: undefined
    };
  };

  registerWidthsGetter(widthsGetter) {
    this.setState(
      prevState => ({ widthsGetters: [ ...prevState.widthsGetters, widthsGetter ] }),
      () => {
        if (this.state.widthsGetters.length === getNumTablesInReport(this.props.processedTimeData)) {
          this.setTableWidths();
        }
      }
    );
  };

  unregisterWidthsGetter(widthsGetter) {
    this.setState(prevState => ({
      widthsGetters: prevState.widthsGetters.filter(fxn => fxn !== widthsGetter)
    }));
  };

  setTableWidths() {
/* NOTE:
    Should probably measure and set col widths before measuring table width (requires an extra setState call)
* * */
    if (this.state.tableWidth || this.state.tableColWidths) {
      return this.setState(
        { tableColWidths: undefined, tableWidth: undefined },
        this.setTableWidths
      );
    }
    let tableColWidths = {}, tableWidth; // (min col width is set to the largest width of all tables in report, so cols are big enough for all tables)
    this.state.widthsGetters
    .map(getWidths => getWidths())
    .forEach(({ table, columns }) => {
      if (!tableWidth || table > tableWidth) {
        tableWidth = table;
      }
      for (const colName of Object.keys(columns)) {
        if (!tableColWidths[colName] || columns[colName] > tableColWidths[colName]) {
          tableColWidths[colName] = columns[colName];
        }
      }
    });
    this.setState({ tableColWidths, tableWidth }, () => console.log(this.state));
  };

  componentDidMount() {
    currentJobTimeService.subscribe(this.setTableWidths);
    windowWidthService.subscribe(this.setTableWidths);
  };

  componentWillUnmount() {
    currentJobTimeService.unsub(this.setTableWidths);
    windowWidthService.unsub(this.setTableWidths);
  };

  render() {
    const { registerWidthsGetter, unregisterWidthsGetter } = this;
    const { processedTimeData, dateRange, style: styleProp } = this.props;
    const { tableColWidths } = this.state;
  
    // console.log('processedTimeData\n', processedTimeData);
  
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
      tableColWidths,
      registerWidthsGetter,
      unregisterWidthsGetter
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
