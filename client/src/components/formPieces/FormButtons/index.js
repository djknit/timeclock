import React from 'react';
import Button from '../../Button';

function FormButtons({
  hasSuccess,
  hasWarning,
  isLoading,
  cancel,
  submit,
  reverseWarning,
  formId,
  submitText = 'Submit',
  warningSubmitText = 'Yes, Continue',
  isFormIncomplete
}) {
  
  return (
    <>
      <Button
        theme="light"
        onClick={cancel}
        disabled={isLoading}
      >
        {hasSuccess ? 'Close' : 'Cancel'}
      </Button> 
      {hasWarning && (
        <Button
          theme="info"
          onClick={reverseWarning}
          disabled={isLoading || hasSuccess}
        >
          Edit Form
        </Button>
      )}
      <Button
        theme={
          (hasSuccess && 'success') ||
          (hasWarning && 'warning') ||
          'primary'
        }
        onClick={submit}
        disabled={isLoading || hasSuccess || isFormIncomplete}
        isSubmit
        {...{
          formId,
          isLoading,
        }}
      >
        {hasWarning ? warningSubmitText : submitText}
      </Button>
    </>
  );
}

export default FormButtons;