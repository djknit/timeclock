import React from 'react';
import {
  extractTimeSegmentInputsProps
} from '../utilities';
import DateTimeInput from '../DateTimeInput';


function TimeSegmentInputs({
  formMgmtComp,
  formId,
  inputRef,
  disabled
}) {

  const extractedProps = extractTimeSegmentInputsProps(formMgmtComp);

  const commonAttrs = { formId, disabled };
  
  return (
    <>
      <div {...extractedProps.firstInputArea}>
        <DateTimeInput
          {...commonAttrs}
          {...extractedProps.firstInput}
          {...{ inputRef }}
        />
      </div>
      <DateTimeInput
        {...extractedProps.lastInput}
        {...commonAttrs}
      />
    </>
  );
};

export default TimeSegmentInputs;
