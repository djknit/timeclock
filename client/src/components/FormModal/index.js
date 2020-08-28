import React from 'react';
import { constants } from '../utilities';
import ModalSkeleton from '../ModalSkeleton';
import { FormButtons, FormMessages } from '../formPieces';

function FormModal({
  formMgmtComponent,
  isFormIncomplete,
  formId,
  infoMessages,
  successMessages,
  successRedirectMessageFragment,
  secondsToDelayRedirect = constants.secondsToDelayRedirect,
  messagesAreaStyle,
  title,
  children
}) {

  const { submit, reset } = formMgmtComponent;
  const { isActive, closeModal } = formMgmtComponent.props;
  const {
    hasSuccess,
    hasProblem,
    hasWarning,
    problemMessages,
    showMessage,
    secondsUntilRedirect,
    isLoading,
    warningMessages
  } = formMgmtComponent.state;

  const successRedirect = successRedirectMessageFragment ? (
    {
      secondsToDelayRedirect,
      secondsRemaining: secondsUntilRedirect,
      messageFragment: successRedirectMessageFragment
    }
  ) : (
    {}
  );

  return (
    <ModalSkeleton
      {...{
        isActive,
        closeModal,
        title
      }}
      isCloseButtonDisabled={isLoading}
      footerContent={
        <FormButtons
          {...{
            hasSuccess,
            hasWarning,
            isLoading,
            submit,
            formId,
            isFormIncomplete
          }}
          cancel={() => {
            reset();
            closeModal();
          }}
          reverseWarning={() => formMgmtComponent.setState({ hasWarning: false })}
        />
      }
    >
      <form id={formId}>
        <MessagesArea style={messagesAreaStyle}>
          <FormMessages
            {...{
              showMessage,
              hasSuccess,
              problemMessages,
              hasWarning,
              hasProblem,
              warningMessages,
              infoMessages,
              successMessages,
              successRedirect
            }}
            closeMessage={() => formMgmtComponent.setState({ showMessage: false })}
          />
        </MessagesArea>
        {children}
      </form>
    </ModalSkeleton>
  );
}

export default FormModal;

function MessagesArea({
  style,
  children
}) {
  return style ? (
    <div {...{ style }}>
      {children}
    </div>
  ) : (
    children
  );
}