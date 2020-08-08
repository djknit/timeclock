import React, { Component } from 'react';
import { api, constants, changeHandlerFactoryFactory, getDayCutoffTime } from '../../utilities';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Notification, { NotificationText } from '../../../../Notification';
import Tag, { TagGroup } from '../../../../Tag';
import { SelectInput, WageInput,  } from '../../../../formPieces';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

const formId = 'edit-job-setting-value-form';
function getStartingState(settingName, currentValue) {
  return {
    hasSuccess: false,
    hasProblem: false,
    problems: {},
    problemMessages: [],
    showMessage: true,
    hasBeenSubmitted: false, 
    secondsUntilRedirect: undefined,
    updatedValue: convertScheduleValueToStateProp(currentValue, settingName)
  };
}
function convertScheduleValueToStateProp(scheduleValue, settingName) {
  switch (settingName) {
    case 'dayCutoff':
      const valueInMinutes = Math.round(scheduleValue / (1000 * 60));
      return getDayCutoffTime(valueInMinutes, true);
    default:
      return scheduleValue;
  }
}

class EditValueModal extends Component {
  constructor(props) {
    super(props);
    this.changeHandlerFactory = changeHandlerFactoryFactory().bind(this);
    this.submit = this.submit.bind(this);
    this.state = getStartingState();
  };

  getInputProblems() {
    const { settingName } = this.props;
    let problems = {};
    let problemMessages = [];
    switch (settingName) {
      case 'timezone':
        break;
      case 'dayCutof':
        break;
      case 'weekBegins':
        break;
      case 'wage':
        break;
    }
  };

  setSubmissionProcessingState() {

  };

  submit() {

  };

  reset() {
    const { scheduleEntry } = this.props;
    this.setState(getStartingState(scheduleEntry && scheduleEntry.value));
  };

  componentDidUpdate(prevProps) {
    const { scheduleEntry } = this.props;
    const previousEntry = prevProps.scheduleEntry;
    const currentEntryId = scheduleEntry && scheduleEntry._id;
    const previousEntryId = previousEntry && previousEntry._id;
    if (currentEntryId !== previousEntryId) this.reset();
  };

  render() {
    return (
      <ModalSkeleton

      >

      </ModalSkeleton>
    );
  };
}

export default EditValueModal;