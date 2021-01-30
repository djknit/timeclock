import React from 'react';
import { constants } from '../../../../utilities';
import { timeSegInputConstants } from './elemental';

const { datePickerPopperHeight } = constants;
const { inputFieldMarginBottom, sectionLabelMarginBottom } = timeSegInputConstants;

function addDatePickerHandlerAndRefs(component) {
  component.firstInputArea = React.createRef();
  component.firstInputAreaLabel = React.createRef();
  component.handleDatepickerPopperToggle = popperToggleHandlerFactory().bind(component);
}

function popperToggleHandlerFactory() {
  return function handleDatepickerPopperToggle(isActiveAfterToggle, isStartDate) {
    // need to make space for datepicker popper above date input.
    const sectionLabelHeight = this.firstInputAreaLabel.current.clientHeight;
    let roomAvailableBelowMsgArea = `${sectionLabelHeight}px + ${sectionLabelMarginBottom}`;
    if (!isStartDate) {
      const firstSectionHeight = this.firstInputArea.current.clientHeight;
      roomAvailableBelowMsgArea += ` + ${firstSectionHeight}px + ${inputFieldMarginBottom}`;
    }
    const msgAreaMinH = `calc(${datePickerPopperHeight} - (${roomAvailableBelowMsgArea}))`;
    this.setState({ messagesAreaMinHeight: isActiveAfterToggle ? msgAreaMinH : undefined });
  };
}

export {
  addDatePickerHandlerAndRefs
};
