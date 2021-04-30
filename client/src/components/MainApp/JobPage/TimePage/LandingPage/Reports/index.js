import React, { Component } from 'react';
import getStyle from './style';
import { currentJobTimeService } from '../../../../../../data';
import { processTimeForReport } from '../../utilities';
import ContentArea from '../../../../ContentArea';
import FullReport from '../../FullReport';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.getTimeDataState = this.getTimeDataState.bind(this);
    this.setTimeDataState = this.setTimeDataState.bind(this);
    this.state = {
      ...this.getTimeDataState()
    };
  };

  getTimeDataState() {
    return { processedTimeData: processTimeForReport(this.props.job.time) };
  };

  setTimeDataState() {
    this.setState(this.getTimeDataState());
  };

  componentDidMount() {
    currentJobTimeService.subscribe(this.setTimeDataState);
  };

  componentWillUnmount() {
    currentJobTimeService.unsub(this.setTimeDataState);
  };
  
  render() {
    const {
      style: styleProp,
      job,
      ...otherProps
    } = this.props;
    const { processedTimeData } = this.state;

    const style = getStyle(styleProp);
    
    return (
      <ContentArea title="Details" style={style.contentArea}>
        <FullReport
          {...{ processedTimeData }}
          {...otherProps}
        />
      </ContentArea>
    );
  };
}

export default Reports;
