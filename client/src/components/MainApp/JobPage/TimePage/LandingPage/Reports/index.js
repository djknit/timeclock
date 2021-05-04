import React, { Component } from 'react';
import getStyle from './style';
// import { currentJobTimeService } from '../../../../../../data';
// import { processTimeForReport } from '../../utilities';
import ContentArea from '../../../../ContentArea';
import FullReport from '../../FullReport';

class Reports extends Component {
  render() {
    const {
      style: styleProp,
      job,
      ...otherProps
    } = this.props;

    const style = getStyle(styleProp);
    
    return (
      <ContentArea title="Details" style={style.contentArea}>
        <FullReport {...otherProps} />
      </ContentArea>
    );
  };
}

export default Reports;
