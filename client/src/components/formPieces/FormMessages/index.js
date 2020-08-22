import React from 'react';
import Notification from '../../Notification';
import ProgressBar from '../ProgressBar';

function FormMessages({
  showMessage,
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

  let theme, messages, close;
  if (hasSuccess) {
    theme = 'success';
    messages = successMessages;
  }
  else if (hasProblem) {
    theme = 'danger';
    messages = problemMessages;
    close = closeMessage;
  }
  else if (hasWarning) {
    theme = 'warning';
    messages = warningMessages;
  }
  else {
    theme = 'info';
    messages = infoMessages;
    close = closeMessage;
  }

  const hasMessages = messages && messages.length > 0;
  const hasProgressBar = hasSuccess && successRedirect;
  const { secondsToDelayRedirect, secondsRemaining, messageFragment } = successRedirect || {};

  if (hasProgressBar && messageFragment) {
    messages.push(`${messageFragment} in ${Math.round(secondsRemaining)} seconds...`);
  }

  return (showMessage && (hasMessages || hasProgressBar)) ? (
    <Notification {...{ theme, messages, close }}>
      {successRedirect && (
        <ProgressBar
          {...{ theme }}
          remaining={secondsRemaining}
          max={secondsToDelayRedirect}
        />
      )}
    </Notification>
  ) : (
    <></>
  );
}

export default FormMessages;