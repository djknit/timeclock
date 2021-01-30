import React from 'react';
import {
  extractTimeSegmentInputsProps
} from '../utilities';
import DateTimeInput from '../DateTimeInput';


function TimeSegmentInputs({
  formMgmtComp,
  formId,
  inputRef
}) {

  const extractedProps = extractTimeSegmentInputsProps(formMgmtComp);
  
  return (
    <>
      <div {...extractedProps.firstInputArea}>
        <DateTimeInput
          {...extractedProps.firstInput}
          {...{
            formId,
            inputRef
          }}
        />
      </div>
      <DateTimeInput
        {...extractedProps.lastInput}
        {...{ formId }}
        />
    </>
  );
};

export default TimeSegmentInputs;
