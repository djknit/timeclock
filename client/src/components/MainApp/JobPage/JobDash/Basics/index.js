import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';

function BasicsArea({
  style,
  disabled
}) {

  const completeStyle = getStyle(style);

  return (
    <ContentArea style={completeStyle.contentArea}>
      <ContentAreaTitle>Basics</ContentAreaTitle>
    </ContentArea>
  );
}

export default BasicsArea;