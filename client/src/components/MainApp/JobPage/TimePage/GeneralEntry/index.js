import React from 'react';
import getStyle from './style';
import ContentArea from '../../../ContentArea';

function GeneralEntry({
  style: styleProp
}) {

  const style = getStyle(styleProp);
  
  return (
    <ContentArea title="Enter Time" style={style.contentArea}>
      
    </ContentArea>
  );
}

export default GeneralEntry;