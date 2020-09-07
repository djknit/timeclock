import React from 'react';
import getStyle from './style';
import { profileService } from '../../../../data';
import ContentArea from '../../ContentArea';
import Button from '../../../Button';
import { addData } from '../../../higherOrder';

function _Account_needsData({
  user,
  style: styleProp,
  accountEditingModalOpenerFactory,
  accountPropDeletingModalOpenerFactory,
  areAnyModalsOpen
}) {

  const style = getStyle(styleProp);

  function EditAccountButtons({ propToEditName }) {
    return (
      <>
        <Button
          theme="primary"
          styles={style.button}
          onClick={accountEditingModalOpenerFactory(propToEditName)}
          allowTabFocus={!areAnyModalsOpen}
        >
          {user[propToEditName] || propToEditName === 'password' ?
            <><i className="fas fa-edit" /> Edit</> :
            <><i className="fas fa-plus" /> Add</>
          }
        </Button>
        {user.username && user.email && propToEditName !== 'password' &&
          <Button
            theme="danger"
            styles={style.buttonNotFirst}
            onClick={accountPropDeletingModalOpenerFactory(propToEditName)}
            allowTabFocus={!areAnyModalsOpen}
          >
            <i className="fas fa-times" /> Delete
          </Button>
        }
      </>
    );
  }

  return (
    <ContentArea title="Account" style={style.contentArea}>
      {user &&
        <>
          <div style={style.accountPropAreaNotLast}>
            <p style={style.propAreaText}>
              <strong>Username:</strong>
              {user.username ?
                ` "${user.username}"` :
                ' You don\'t currently have a username.'
              }
            </p>
            <EditAccountButtons propToEditName="username" />
          </div>
          <div style={style.accountPropAreaNotLast}>
            <p style={style.propAreaText}>
              <strong>Email:</strong>
              {user.email ?
                ` "${user.email}"` :
                ' You don\'t currently have an email address attached to your account.'
              }
            </p>
            <EditAccountButtons propToEditName="email" />
          </div>
          <div style={style.lastAccountPropArea}>
            <p style={style.propAreaText}>
              <strong>Password:</strong> "&bull;&bull;&bull;&bull;..."
            </p>
            <EditAccountButtons propToEditName="password" />
          </div>
        </>
      }
    </ContentArea>
  );
}

const Account = addData(_Account_needsData, 'user', profileService);

export default Account;