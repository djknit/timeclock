import React from 'react';
import getStyle from './style';
import { currentJobSessionTzStore } from '../../../../../data';
import { getTimezoneAbbreviation, constants } from '../utilities';
import Notification, { NotificationText } from '../../../../Notification';
import Button from '../../../../Button';
import Tags from './Tags';

const { iconClassNames: { editSessionTimezone } } = constants;

function ModalTimezoneInfo({
  showMessage,
  toggleMessage,
  toggleSessionTimezoneModal,
  disabled,
  margin = '0.75em',
}) {

  const { sessionTimezone } = currentJobSessionTzStore;

  const tzAbbreviation = getTimezoneAbbreviation(sessionTimezone);

  const style = getStyle();

  return showMessage ? (
    <Notification
      theme="info light"
      close={() => toggleMessage(false)}
      style={style.notification}
      {...{ disabled }}
    >
      <NotificationText>
        All times are in {tzAbbreviation} (timezone "{sessionTimezone}").
      </NotificationText>
      <Button
        theme="primary"
        onClick={() => toggleSessionTimezoneModal(true)}
        style={style.inNotificationBtn}
      >
        <i className={editSessionTimezone} /> Change
      </Button>
    </Notification>
  ) : (
    <Tags
      {...{
        toggleMessage,
        sessionTimezone,
        toggleSessionTimezoneModal,
        disabled
      }}
    />
  );
}

export default ModalTimezoneInfo;
