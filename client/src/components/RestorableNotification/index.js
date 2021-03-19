import React from 'react';
import { getCollapsedNoteStyle } from './style';
import Notification from '../Notification';
import InfoButton from '../InfoButton';

function RestorableNotification({
  showMessage,
  toggleMessage,
  theme,
  disabled,
  messages,
  children,
  allowRestore = true,
  buttonIconClassName
}) {

  return showMessage ? (
    <Notification
      {...{
        theme,
        messages,
        children,
        disabled
      }}
      close={() => toggleMessage(false)}
    />
  ) : (
    <CollapsedNote
      {...{
        allowRestore,
        buttonIconClassName,
        toggleMessage,
        theme,
        disabled
      }}
    />
  );
}

export default RestorableNotification;


function CollapsedNote({
  allowRestore,
  buttonIconClassName,
  toggleMessage,
  ...otherButtonProps
}) {

  const style = getCollapsedNoteStyle();

  return allowRestore ? (
    <div style={style.buttonArea}>
      <InfoButton
        onClick={() => toggleMessage(true)}
        {...otherButtonProps}
        iconClassName={buttonIconClassName}
      />
    </div>
  ) : (
    <></>
  );
}
