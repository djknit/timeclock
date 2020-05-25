import React from 'react';
import getStyle from './style';
import { profileService } from '../../../../data';
import ContentArea from '../../ContentArea';
import { addData } from '../../../higherOrder';

function _Account_needsData({
  user,
  style
}) {

  const completeStyle = getStyle(style);

  return (
    <ContentArea title="Account" style={completeStyle.contentArea}>

    </ContentArea>
  );
}

const Account = addData(_Account_needsData, 'user', profileService);

export default Account;