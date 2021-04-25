import React, { Component } from 'react';
import getStyle from './style';
import { currentJobTimeService, windowWidthService } from '../../../../../data';
import { getNumTablesInReport } from './utilities';
import Week from './Week';
import Totals from './Totals';

class FullReport extends Component {
  constructor() {
    super();
    this.registerColWidthsGetter = this.registerColWidthsGetter.bind(this);
    this.unregisterColWidthsGetter = this.unregisterColWidthsGetter.bind(this);
    this.setTableColWidths = this.setTableColWidths.bind(this);
    this.state = {
      tableColWidths: undefined,
      colWidthsGetters: []
    };
  };

  registerColWidthsGetter(widthsGetter) {
    this.setState(
      prevState => ({
        colWidthsGetters: [ ...prevState.colWidthsGetters, widthsGetter ]
      }),
      () => {
        if (this.state.colWidthsGetters.length === getNumTablesInReport(this.props.processedTimeData)) {
          this.setTableColWidths();
        }
      }
    );
  };

  unregisterColWidthsGetter(widthsGetter) {
    this.setState(prevState => ({
      colWidthsGetters: prevState.colWidthsGetters.filter(fxn => fxn !== widthsGetter)
    }));
  };

  setTableColWidths() {
    if (this.state.fullReportColWidths) {
      return this.setState({ fullReportColWidths: undefined }, this.setTableColWidths);
    }
    let fullReportColWidths = {}; // (min col width is set to the largest width of all tables in report, so cols are big enough for all tables)
    for (const tableColsWidthGetter of this.state.colWidthsGetters) {
      const thisTableColWidths = tableColsWidthGetter();
      Object.keys(thisTableColWidths).forEach(colName => {
        if (
          !fullReportColWidths[colName] ||
          fullReportColWidths[colName] < thisTableColWidths[colName]
        ) {
          fullReportColWidths[colName] = thisTableColWidths[colName];
        }
      });
    }
    this.setState({ tableColWidths: fullReportColWidths });
  };

  componentDidMount() {
    currentJobTimeService.subscribe(this.setTableColWidths);
    windowWidthService.subscribe(this.setTableColWidths);
  };

  componentWillUnmount() {
    currentJobTimeService.unsub(this.setTableColWidths);
    windowWidthService.unsub(this.setTableColWidths);
  };

  render() {
    const { registerColWidthsGetter, unregisterColWidthsGetter } = this;
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
      registerColWidthsGetter,
      unregisterColWidthsGetter
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
