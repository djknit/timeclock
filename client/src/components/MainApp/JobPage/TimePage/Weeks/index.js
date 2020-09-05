import React from 'react';
import getStyle from './style';
import ContentArea from '../../../ContentArea';

function Weeks({
  style: styleProp
}) {

  const style = getStyle(styleProp);
  
  return (
    <ContentArea style={style.contentArea}>

    </ContentArea>
  );
}

export default Weeks;