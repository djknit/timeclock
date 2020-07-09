import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';

function TimeArea({
  style,
  dsiabled
}) {

  const completeStyle = getStyle(style);

  return (
    <ContentArea style={completeStyle.contentArea}>
      <ContentAreaTitle>Time</ContentAreaTitle>
    </ContentArea>
  );
}

export default TimeArea;