import React from 'react';
import Notification, { NotificationText } from '../../Notification';
import ProgressBar from '../ProgressBar';

function FormMessages({
  showMessage,
  closeMessage,
  hasSuccess,
  successRedirect,
  ...otherProps
}) {

  const { theme, messages, close } = getThemeAndRelated({ successRedirect, hasSuccess, ...otherProps });

  if (!showMessage || !messages || messages.length === 0) {
    return <></>;
  }

  if (hasSuccess && successRedirect) {
    const { secondsToDelayRedirect, secondsRemaining } = successRedirect;
    return (
      <Notification {...{ theme, close }}>
        {messages.map(msg => (
          <NotificationText>{msg}</NotificationText>
        ))}
        <ProgressBar
          {...{ theme }}
          value={secondsToDelayRedirect - secondsRemaining}
          max={secondsToDelayRedirect}
        />
      </Notification>
    );
  }
  
  return (
    <Notification {...{ theme, messages, close }} />
  );
}

export default FormMessages;

function getThemeAndRelated({
  hasSuccess,
  hasProblem,
  hasWarning,
  successMessages,
  problemMessages,
  infoMessages,
  warningMessages,
  successRedirect,
  closeMessage
}) {
  let theme, messages, allowClose;
  if (hasSuccess) {
    theme = 'success';
    messages = getCompleteSuccessMessages(successMessages, successRedirect);
  }
  else if (hasProblem) {
    theme = 'danger';
    messages = problemMessages;
    allowClose = true;
  }
  else if (hasWarning) {
    theme = 'warning';
    messages = warningMessages;
  }
  else {
    theme = 'info';
    messages = infoMessages;
    allowClose = true;
  }
  const close = allowClose && closeMessage;
  return { theme, messages, close };
}

function getCompleteSuccessMessages(successMessages, successRedirect) {
  const { secondsRemaining, messageFragment } = successRedirect || {};
  let messages = successMessages || [];
  if (successRedirect && messageFragment) {
    messages.push(`${messageFragment} in ${Math.round(secondsRemaining)} seconds...`);
  }
  return messages;
}