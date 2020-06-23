import React from 'react';
import getStyle from './style';
import { profileService } from '../../../../data';
import ContentArea from '../../ContentArea';
import Button from '../../../Button';
import { addData } from '../../../higherOrder';

function _Account_needsData({
  user,
  style,
  accountEditingModalOpenerFactory
}) {

  const completeStyle = getStyle(style);

  return (
    <ContentArea title="Account" style={completeStyle.contentArea}>
      {user &&
        <>
          <div style={completeStyle.accountPropAreaNotLast}>
            <p style={completeStyle.propAreaText}>
              <strong>Username:</strong>
              {user.username ?
                ` "${user.username}"` :
                ' You don\'t currently have a username.'
              }
            </p>
            <Button
              color="primary"
              styles={completeStyle.button}
              onClick={accountEditingModalOpenerFactory('username')}
            >
              {user.username ?
                <><i className="fas fa-edit"></i> Edit</> :
                <><i className="fas fa-plus"></i> Add</>
              }
            </Button>
          </div>
          <div style={completeStyle.accountPropAreaNotLast}>
            <p style={completeStyle.propAreaText}>
              <strong>Email:</strong>
              {user.email ?
                ` "${user.email}"` :
                ' You don\'t currently have an email address attached to your account.'
              }
            </p>
            <Button
              color="primary"
              styles={completeStyle.button}
              onClick={accountEditingModalOpenerFactory('email')}
            >
              {user.email ?
                <><i className="fas fa-edit"></i> Edit</> :
                <><i className="fas fa-plus"></i> Add</>
              }
            </Button>
          </div>
          <div style={completeStyle.lastAccountPropArea}>
            <p style={completeStyle.propAreaText}>
              <strong>Password:</strong> "&bull;&bull;&bull;&bull;..."
            </p>
            <Button
              color="primary"
              styles={completeStyle.button}
              onClick={accountEditingModalOpenerFactory('password')}
            >
              <i className="fas fa-edit"></i> Edit
            </Button>
          </div>
        </>
      }
    </ContentArea>
  );
}

const Account = addData(_Account_needsData, 'user', profileService);

export default Account;