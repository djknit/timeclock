import React from 'react';
import getStyle from './style';
import { profileService } from '../../../../data';
import ContentArea from '../../ContentArea';
import Button from '../../../Button';
import { addData } from '../../../higherOrder';

function _Account_needsData({
  user,
  style,
  openEditAccountModal
}) {

  const completeStyle = getStyle(style);

  console.log(user)

  return (
    <ContentArea title="Account" style={completeStyle.contentArea}>
      {user &&
        <>
          <p style={completeStyle.infoText}>
            <strong>Username:</strong>
            {user.username ?
              ` "${user.username}"` :
              ' You don\'t currently have a username.'
            }
            
          </p>
          <p style={completeStyle.infoText}>
            <strong>Email:</strong>
            {user.email ?
              ` "${user.email}"` :
              ' You don\'t currently have an email address attached to your account.'
            }
          </p>
          <p style={completeStyle.infoText}>
            <strong>Password:</strong> "&bull;&bull;&bull;&bull;..."
          </p>
        </>
      }
      <div style={completeStyle.buttonArea}>
        <Button color="primary" styles={completeStyle.button} onClick={openEditAccountModal}>
          <i className="fas fa-edit"></i> Edit
        </Button>
      </div>
    </ContentArea>
  );
}

const Account = addData(_Account_needsData, 'user', profileService);

export default Account;