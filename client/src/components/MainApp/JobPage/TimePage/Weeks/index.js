import React from 'react';
import getStyle from './style';
import ContentArea from '../../../ContentArea';

function Weeks({
  style: styleProp
}) {

  const style = getStyle(styleProp);
  
  return (
    <ContentArea title="View/Enter Time By Week" style={style.contentArea}>

    </ContentArea>
  );
}

export default Weeks;