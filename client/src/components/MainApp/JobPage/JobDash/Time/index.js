import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';

function TimeArea({
  style: styleProp,
  dsiabled
}) {

  const style = getStyle(styleProp);

  return (
    <ContentArea style={style.contentArea}>
      <ContentAreaTitle>Time</ContentAreaTitle>
    </ContentArea>
  );
}

export default TimeArea;