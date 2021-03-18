import React from 'react';
import RestorableNotification from '../../RestorableNotification';
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
  disabled,
  allowRestore,
  toggleMessage
}) {

  let theme, messages, close;
  if (hasSuccess) {
    theme = 'success';
    messages = successMessages;
  }
  else if (hasProblem) {
    theme = 'danger';
    messages = problemMessages;
    close = () => toggleMessage(false);
  }
  else if (hasWarning) {
    theme = 'warning';
    messages = warningMessages;
  }
  else {
    theme = 'info';
    messages = infoMessages;
    close = () => toggleMessage(false);
  }
  if (disabled) close = undefined;

  const hasMessages = messages && messages.length > 0;
  const hasProgressBar = hasSuccess && successRedirect;
  const { secondsToDelayRedirect, secondsRemaining, messageFragment } = successRedirect || {};

  if (hasProgressBar && messageFragment) {
    messages.push(`${messageFragment} in ${Math.round(secondsRemaining)} seconds...`);
  }

  return (hasMessages || hasProgressBar) ? (
    <RestorableNotification
      {...{
        theme,
        messages,
        allowRestore,
        showMessage,
        toggleMessage
      }}
    >
      {hasProgressBar && (
        <ProgressBar
          {...{ theme }}
          remaining={secondsRemaining}
          max={secondsToDelayRedirect}
        />
      )}
    </RestorableNotification>
  ) : (
    <></>
  );
}

export default FormMessages;