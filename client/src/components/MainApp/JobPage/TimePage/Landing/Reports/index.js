import React, { Component } from 'react';
import getStyle from './style';
import { processTimeForReport } from '../../utilities';
import ContentArea from '../../../../ContentArea';
import FullReport from '../../FullReport';

class Reports extends Component {
  render() {
    const {
      style: styleProp,
      job,
      windowWidth,
      disabled
    } = this.props;

    const processedTimeData = processTimeForReport(job.time);

    const style = getStyle(styleProp);
    
    return (
      <ContentArea title="Details" style={style.contentArea}>
        <FullReport
          {...{ processedTimeData }}
        />
      </ContentArea>
    );
  };
}

export default Reports;
