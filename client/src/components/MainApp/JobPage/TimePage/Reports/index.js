import React from 'react';
import getStyle from './style';
import { processTimeForReport } from '../utilities';
import ContentArea from '../../../ContentArea';

function Reports({
  style: styleProp
}) {

  const style = getStyle(styleProp);
  
  return (
    <ContentArea title="View Time Details" style={style.contentArea}>
      
    </ContentArea>
  );
}

export default Reports;
