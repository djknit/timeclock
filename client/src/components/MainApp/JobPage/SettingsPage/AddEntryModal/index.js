import React, { Component } from 'react';
import {
  api,
  constants,
  changeHandlerFactoryFactory,
  addWageInputRefs,
  extractWageInputRefs,
  getJobSettingInputProblems,
  getDateRangeText,
  getSettingInputInitialValues,
  processWageValueForDisplay
} from '../../utilities';
import { windowWidthService, currentJobService } from '../../../../../data';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Notification, { NotificationText } from '../../../../Notification';
import Tag, { TagGroup } from '../../../../Tag';
import { ProgressBar, DateInput } from '../../../../formPieces';
import SettingValueInput from '../SettingValueInput';
import { addCollapsing } from '../../../../higherOrder';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

const formId = 'add-job-setting-schedule-entry';
function getStartingState(settingName) {
  const jobSettingInitialInputValues = getSettingInputInitialValues();
  console.log('add entry start state for '+settingName)
  console.log(jobSettingInitialInputValues[settingName])
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

class _AddEntryModal_needsCollapsing extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory(this.afterChange).bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.getInputDataProcessedToSubmit = this.getInputDataProcessedToSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    addWageInputRefs(this);
    this.state = getStartingState(this.props.settingName);
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
    const { settingName, contentToggle } = this.props;
    this.setState(getStartingState(settingName));
    if (contentToggle && contentToggle.reset) contentToggle.reset();
  };

  componentDidUpdate(prevProps) {
    const { isActive, windowWidth, contentToggle, settingName } = this.props;
    const shouldToggleBeSet = isActive && settingName === 'wage' && !!this.state.settingValue;
    if (
      shouldToggleBeSet &&
      (!contentToggle.isHeightSet || windowWidth !== prevProps.windowWidth || !prevProps.isActive)
    ) {
      contentToggle.setHeight();
    }
    else if (!shouldToggleBeSet && contentToggle && contentToggle.isHeightSet) {
      contentToggle.clearHeight();
    }
  };

  render() {
    const { reset, submit, changeHandlerFactory } = this;
    const {
      isActive,
      closeModal,
      settingDisplayName,
      settingName,
      contentToggle
    } = this.props;
    const {
      hasSuccess,
      hasProblem,
      problems,
      problemMessages,
      showMessage,
      secondsUntilRedirect,
      settingValue,
      startDate,
      isLoading
    } = this.state;

    const closeMessage = () => this.setState({ showMessage: false });

    const lowCaseSettingName = settingDisplayName.toLowerCase();

    const wageInputRefs = extractWageInputRefs(this);

    const getCommonFormAttrs = (
      propName => ({
        propName,
        value: this.state[propName],
        problems: problems && problems[propName],
        settingName,
        changeHandlerFactory,
        formId,
        isActive: !isLoading && !hasSuccess
      })
    );

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title={`Add ${settingDisplayName} Schedule Entry`}
        isCloseButtonDisabled={isLoading}
        footerContent={
          <>
            <Button
              theme="light"
              onClick={() => {
                reset();
                closeModal();
              }}
            >
              {hasSuccess ? 'Close' : 'Cancel'}
            </Button>
            <Button
              theme={hasSuccess ? 'success' : 'primary'}
              onClick={submit}
              disabled={isLoading || hasSuccess || !startDate || !settingValue}
              isSubmit
              {...{
                formId,
                isLoading
              }}
            >
              Submit
            </Button>
          </>
        }
      >
        <form id={formId}>
          {showMessage && !hasProblem && !hasSuccess && (
            <Notification theme="info" close={closeMessage}>
              <NotificationText isLast>
                Enter the new {lowCaseSettingName} value and the date on which that value goes into effect below.
              </NotificationText>
            </Notification>
          )}
          {showMessage && problemMessages.length > 0 && (
            <Notification theme="danger" close={closeMessage}>
              {problemMessages.map(
                (message, index, arr) => (
                  <NotificationText key={message} isLast={index === arr.length - 1}>
                    {message}
                  </NotificationText>
                )
              )}
            </Notification>
          )}
          {showMessage && hasSuccess && (
            <Notification theme="success">
              <NotificationText>
                You successfully added a new {lowCaseSettingName} value to the schedule.
              </NotificationText>
              <NotificationText>
                This dialog box will close in {Math.floor(secondsUntilRedirect + .5)} seconds...
              </NotificationText>
              <ProgressBar
                theme="success"
                value={secondsToDelayRedirect - secondsUntilRedirect}
                max={secondsToDelayRedirect}
              />
            </Notification>
          )}
          <SettingValueInput
            {...getCommonFormAttrs('settingValue')}
            {...{ wageInputRefs }}
            wageContentToggle={contentToggle}
            label={`New ${settingDisplayName} Value:`}
          />
          <DateInput
            {...getCommonFormAttrs('startDate')}

          />
        </form>
      </ModalSkeleton>
    );
  };
}

const AddEntryModal = addCollapsing(_AddEntryModal_needsCollapsing, 'contentToggle', true, true);

export default AddEntryModal;