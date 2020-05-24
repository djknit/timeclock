import React from 'react';
import { profileService } from '../../../../data';
import ContentArea from '../../ContentArea';
import { addData } from '../../../higherOrder';

function _Account_needsData({
  user
}) {

  return (
    <ContentArea></ContentArea>
  );
}

const Account = addData(_Account_needsData, 'user', profileService);

export default Account;