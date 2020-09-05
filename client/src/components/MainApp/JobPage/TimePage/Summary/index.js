import React from 'react';
import getStyle from './style';
import ContentArea from '../../../ContentArea';

function Summary({
  style: styleProp
}) {

  const style = getStyle(styleProp);

  return (
    <ContentArea title="Summary" style={style.contentArea}>

    </ContentArea>
  );
}

export default Summary;