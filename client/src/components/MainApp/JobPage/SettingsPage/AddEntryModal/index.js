import React, { Component } from 'react';
import {
  api,
  constants,
  changeHandlerFactoryFactory,
  addWageInputRefs,
  extractWageInputRefs,
  processWageInput,
  getJobSettingInputProblems,
  processDayCutoffInput,
  getDateRangeText,
  convertSettingValueToFormData,
  getSettingInputInitialValues,
  processWageValueForDisplay
} from '../../utilities';
import { windowWidthService, currentJobService } from '../../../../../data';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Notification, { NotificationText } from '../../../../Notification';
import Tag, { TagGroup } from '../../../../Tag';
import { ProgressBar, DateInput } from '../../../../formPieces';
// import Input from './Input';
import { addCollapsing, addData } from '../../../../higherOrder';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

const formId = 'add-job-setting-schedule-entry';
function getStartingState(settingName) {
  const jobSettingInitialInputValues = getSettingInputInitialValues();
  return {
    hasSuccess: false,
    hasProblem: false,
    isLoading: false,
    problems: {},
    problemMessages: [],
    showMessage: true,
    hasBeenSubmitted: false, 
    secondsUntilRedirect: undefined,
    settingValue: jobSettingInitialInputValues[settingName],
    startDate: null
  };
}

class AddEntryModal extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory(this.afterChange).bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.getInputDataProcessedToSubmit = this.getInputDataProcessedToSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    addWageInputRefs(this);
    this.state = getStartingState();
  };

  afterChange() {
    if (this.state.hasBeenSubmitted) {
      this.setState(this.getInputProblems());
    }
  };

  getInputProblems() {
    const { settingName } = this.props;
    const { settingValue, startDate } = this.state;
    let problems = {};
    let problemMessages = [];
    problems.settingValue = getJobSettingInputProblems(settingName, settingValue, problemMessages);
    if (!startDate) {
      problems.startDate = true;
      problemMessages.push('You must enter the start date.');
    }
    return { problems, problemMessages };
  };

  setSubmissionProcessingState() {
    return new Promise(resolve => {
      this.setState(
        {
          hasBeenSubmitted: true,
          isLoading: true,
          hasProblem: false,
          showMessage: false,
          problems: {},
          problemMessages: []
        },
        resolve
      );
    });
  };

  getInputDataProcessedToSubmit() {
    const { settingName, jobId } = this.props;
    const { startDate, settingValue } = this.state;
    const updates = {
      add: [{
        startDate,
        value: processWageValueForDisplay(settingName, settingValue)
      }]
    };
    return { jobId, updates };
  };

  submit(event) {
    event.preventDefault();
    const { settingName } = this.props;
    this.setSubmissionProcessingState()
    .then(() => {
      const { problems, problemMessages } = this.getInputProblems();
      if (problemMessages.length > 0) {
        throw { problems, messages: problemMessages };
      }
      const submissionData = this.getInputDataProcessedToSubmit();
      return api.jobs.updateSetting(settingName, submissionData);
    })
    .then(res => {
      let secondsUntilRedirect = secondsToDelayRedirect;
      this.setState({
        hasSuccess: true,
        isLoading: false,
        hasProblem: false,
        showMessage: true,
        problems: {},
        problemMessages: [],
        secondsUntilRedirect
      });
      currentJobService.setCurrentJob(res.data);
      const intervalId = setInterval(
        () => {
          secondsUntilRedirect -= stepSizeOfRedirectDelay;
          this.setState({ secondsUntilRedirect });
          if (secondsUntilRedirect <= 0) {
            clearInterval(intervalId);
            this.props.closeModal();
            this.reset();
          }
        },
        1000 * stepSizeOfRedirectDelay
      );
    })
    .catch(err => {
      this.props.catchApiUnauthorized(err);
      const errorData = (err && err.response && err.response.data) || err || {};
      let { problems, messages } = errorData;
      if (!problems) problems = {};
      if (!messages) messages = [];
      this.setState({
        problems,
        problemMessages: messages,
        hasProblem: true,
        isLoading: false,
        showMessage: true
      });
    })
  };

  reset() {
    
  };

  render() {
    return (
      <ModalSkeleton

      >

      </ModalSkeleton>
    );
  };
}

export default AddEntryModal;