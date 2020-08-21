import React, { Component } from 'react';
import {
  api,
  constants,
  changeHandlerFactoryFactory,
  addWageInputRefs,
  extractWageInputRefs,
  getJobSettingInputProblems,
  getSettingInputInitialValues,
  processJobSettingInputValue,
  formatMyDate,
  getAddUpdateWarnings
} from '../utilities';
import { currentJobService } from '../../../../../data';
import getStyle from './style';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Notification, { NotificationText } from '../../../../Notification';
import { ProgressBar, DateInput } from '../../../../formPieces';
import SettingValueInput from '../SettingValueInput';
import { addCollapsing } from '../../../../higherOrder';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

const formId = 'add-job-setting-schedule-entry';
function getStartingState(settingName) {
  const jobSettingInitialInputValues = getSettingInputInitialValues();
  return {
    hasSuccess: false,
    hasProblem: false,
    isLoading: false,
    hasWarning: false,
    problems: {},
    problemMessages: [],
    showMessage: true,
    hasBeenSubmitted: false, 
    secondsUntilRedirect: undefined,
    settingValue: jobSettingInitialInputValues[settingName],
    startDate: null,
    messagesAreaMinHeight: undefined
  };
}

class _AddEntryModal_needsCollapsing extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.handleDatepickerPopperToggle = this.handleDatepickerPopperToggle.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory(this.afterChange).bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.getInputDataProcessedToSubmit = this.getInputDataProcessedToSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    addWageInputRefs(this);
    this.firstInputArea = React.createRef();
    this.state = getStartingState(this.props.settingName);
  };

  afterChange() {
    if (this.state.hasBeenSubmitted) {
      this.setState(this.getInputProblems());
    }
  };

  handleDatepickerPopperToggle(isActiveAfterToggle) {
    // need to make space for datepicker popper above date input.
    // popper w/ margin extends 289.3px above top of date input.
    // area above date input consists of dateInput label, first input field, and messages area
    // date input label w/ margin is 2rem
    // NEED: 2rem + (1stInputAreaHeight) + (msgAreaHeight) >= 289.3px
    // therefore: (msgAreaHeight) >= 289.3px - 2rem - (1stInputAreaHeight)
    const firstInputHeight = this.firstInputArea.current.clientHeight;
    this.setState({
      messagesAreaMinHeight: isActiveAfterToggle ? (
        `calc(289.3px - 2rem - ${firstInputHeight}px)`
      ) : (
        undefined
      )
    });
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
        value: processJobSettingInputValue(settingName, settingValue)
      }]
    };
    return { jobId, updates };
  };

  submit(event) {
    event.preventDefault();
    const { settingName, valueSchedule, settingDisplayName } = this.props;
    const { hasWarning, startDate } = this.state;
    this.setSubmissionProcessingState()
    .then(() => {
      const { problems, problemMessages } = this.getInputProblems();
      if (problemMessages.length > 0) {
        throw { problems, messages: problemMessages };
      }
      // only check for warning if NOT already in warning state
      let _warningInfo = hasWarning ? {} : getAddUpdateWarnings(startDate, valueSchedule, settingDisplayName);
      if (_warningInfo.hasWarning) {
        throw {
          isWarning: true,
          messages: _warningInfo.warningMessages
        };
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
        hasWarning: false,
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
      const { isWarning } = err || {};
      this.props.catchApiUnauthorized(err);
      const errorData = (err && err.response && err.response.data) || err || {};
      let { problems, messages } = errorData;
      if (!messages) messages = [];
      this.setState({
        problems: problems || {},
        problemMessages: !isWarning ? messages : [],
        hasProblem: !isWarning,
        isLoading: false,
        showMessage: true,
        hasWarning: isWarning,
        warningMessages: isWarning ? messages : []
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
    const {
      reset, submit, changeHandlerFactory, firstInputArea, handleDatepickerPopperToggle
    } = this;
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
      hasWarning,
      problems,
      problemMessages,
      showMessage,
      secondsUntilRedirect,
      settingValue,
      startDate,
      isLoading,
      messagesAreaMinHeight
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
        isActive: !isLoading && !hasSuccess && !hasWarning
      })
    );

    const style = getStyle(messagesAreaMinHeight);

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
            {hasWarning && (
              <Button
                theme="info"
                onClick={() => this.setState({ hasWarning: false })}
                disabled={isLoading || hasSuccess}
              >
                Edit Form
              </Button>
            )}
            <Button
              theme={(hasSuccess && 'success') || (hasWarning && 'warning') || 'primary'}
              onClick={submit}
              disabled={isLoading || hasSuccess || !startDate || !settingValue}
              isSubmit
              {...{
                formId,
                isLoading
              }}
            >
              {hasWarning ? 'Yes, Replace Value' : 'Submit'}
            </Button>
          </>
        }
      >
        <form id={formId}>
          <div style={style.messagesArea}>
            {showMessage && !hasProblem && !hasSuccess && !hasWarning && (
              <Notification theme="info" close={closeMessage}>
                <NotificationText isLast>
                  Enter the new {lowCaseSettingName} value and the date on which that value goes into effect below.
                </NotificationText>
              </Notification>
            )}
            {showMessage && problemMessages.length > 0 && (
              <Notification theme="danger" close={closeMessage} messages={problemMessages} />
            )}
            {showMessage && hasWarning && (
              <Notification theme="warning">
                <NotificationText>
                  You already have a {lowCaseSettingName} value with the same start date ({formatMyDate(startDate)}).
                </NotificationText>
                <NotificationText isLast>
                  Are you sure you want to replace the existing schedule value?
                </NotificationText>
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
          </div>
          <div ref={firstInputArea} style={style.firstInputArea}>
            <SettingValueInput
              {...getCommonFormAttrs('settingValue')}
              {...{ wageInputRefs }}
              wageContentToggle={contentToggle}
              label={`New ${settingDisplayName} Value:`}
              fieldStyle={style.firstInputField}
            />
          </div>
          <DateInput
            {...getCommonFormAttrs('startDate')}
            label="Start Date:"
            helpText="When does the new value go into effect? Select the first day that the new setting value applies."
            placeholder="Start date..."
            labelStyle={style.inputLabel}
            datePickerProps={{
              popperPlacement: 'top-start',
              onCalendarOpen: () => handleDatepickerPopperToggle(true),
              onCalendarClose: () => handleDatepickerPopperToggle(false)
            }}
          />
        </form>
      </ModalSkeleton>
    );
  };
}

const AddEntryModal = addCollapsing(_AddEntryModal_needsCollapsing, 'contentToggle', true, true);

export default AddEntryModal;