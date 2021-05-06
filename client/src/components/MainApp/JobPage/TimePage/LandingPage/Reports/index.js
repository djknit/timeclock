import React, { Component } from 'react';
import getStyle from './style';
import ContentArea from '../../../../ContentArea';
import FullReport from '../../FullReport';

function Reports({
  style: styleProp,
  job,
  ...otherProps
}) {

  const style = getStyle(styleProp);

  return (
    <ContentArea title="Details" style={style.contentArea}>
      <FullReport {...otherProps} />
    </ContentArea>
  );
}

export default Reports;
