import React from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';

function SettingsArea({
  style,
  disabled
}) {

  const completeStyle = getStyle(style);

  return (
    <ContentArea style={completeStyle.contentArea}>
      <ContentAreaTitle>Settings</ContentAreaTitle>
    </ContentArea>
  );
}

export default SettingsArea;