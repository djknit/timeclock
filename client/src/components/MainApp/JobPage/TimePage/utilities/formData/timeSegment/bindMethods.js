import { timeSegmentFormAfterChangeFactory } from './autoInputChanges.js';
import { addDatePickerHandlerAndRefs } from './datepicker';
import { timeSegInputProblemsGetterFactory } from './inputProblems';
import { warningsGetterFactory } from './warnings';

function bindTimeSegFormMethodsAndRefs(comp, isEditSegForm) {
  comp.getInputProblems = timeSegInputProblemsGetterFactory(isEditSegForm).bind(comp);
  comp.afterChange = timeSegmentFormAfterChangeFactory().bind(comp);
  comp.getWarnings = warningsGetterFactory().bind(comp);
  addDatePickerHandlerAndRefs(comp);
}

export {
  bindTimeSegFormMethodsAndRefs
};
