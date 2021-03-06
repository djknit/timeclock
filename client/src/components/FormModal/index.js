import React from 'react';
import { constants, extractFormContainerRef } from '../utilities';
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
  children,
  messagesAreaContent,
  submitText,
  warningSubmitText,
  disableCloseOnSuccess
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

  const bodyRef = extractFormContainerRef(formMgmtComponent);

  const successRedirect = successRedirectMessageFragment ? (
    {
      secondsToDelayRedirect,
      secondsRemaining: secondsUntilRedirect,
      messageFragment: successRedirectMessageFragment
    }
  ) : (
    {}
  );
  
  const isCloseButtonDisabled = isLoading || (disableCloseOnSuccess && hasSuccess);

  return (
    <ModalSkeleton
      {...{
        isActive,
        closeModal,
        title,
        isCloseButtonDisabled,
        bodyRef
      }}
      footerContent={
        <FormButtons
          {...{
            hasSuccess,
            hasWarning,
            isLoading,
            submit,
            formId,
            isFormIncomplete,
            submitText,
            warningSubmitText
          }}
          isCancelDisabled={isCloseButtonDisabled}
          cancel={() => {
            reset();
            closeModal();
          }}
          reverseWarning={() => formMgmtComponent.setState({ hasWarning: false })}
        />
      }
    >
      <Form {...{ formId }}>
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
            toggleMessage={shouldShowMsg => formMgmtComponent.setState({ showMessage: shouldShowMsg })}
          />
          {messagesAreaContent}
        </MessagesArea>
        {children}
      </Form>
    </ModalSkeleton>
  );
}

export default FormModal;

function Form({ formId: id, children }) {
  return id ? (<form {...{ id, children }} />) : children;
}

function MessagesArea({ style, children }) {
  return style ? (
    <div {...{ style }}>{children}</div>
  ) : (
    children
  );
}