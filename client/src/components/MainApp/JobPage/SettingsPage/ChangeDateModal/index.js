import React, { Component } from 'react';
import {
  api, 
  constants,
  changeHandlerFactoryFactory,
  getDateChangeUpdateWarnings
} from '../utilities';
import { currentJobService } from '../../../../../data';
import getStyle from './style';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Notification, { NotificationText } from '../../../../Notification';
import Tag, { TagGroup } from '../../../../Tag';
import { DateInput, ProgressBar } from '../../../../formPieces';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

const formId = 'change-job-setting-date-form';
function getStartingState(currentStartDate) {
  return {
    hasSuccess: false,
    hasProblem: false,
    hasWarning: false,
    isLoading: false,
    problems: {},
    problemMessages: [],
    warningMessages: [],
    showMessage: true,
    hasBeenSubmitted: false,
    secondsUntilRedirect: undefined,
    updatedStartDate: currentStartDate,
    messagesAreaMinHeight: undefined
  };
}

class ChangeDateModal extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory(this.afterChange).bind(this);
    this.handleDatepickerPopperToggle = this.handleDatepickerPopperToggle.bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.setSubmissionProcessingState = this.setSubmissionProcessingState.bind(this);
    this.getDataProcessedToSubmit = this.getDataProcessedToSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = getStartingState();
  };

  afterChange() {
    if (this.state.hasBeenSubmitted) {
      this.setState(this.getInputProblems());
    }
  };

  handleDatepickerPopperToggle(isActiveAfterToggle) {
    // Make room for popper in above input. Needs 289.3px height. Input label w/ margin is 2rem.
    this.setState({
      messagesAreaMinHeight: isActiveAfterToggle ? `calc(289.3px - 2rem)` : undefined
    })
  };

  getInputProblems() {
    const { updatedStartDate } = this.state;
    let problems = {};
    let problemMessages = [];
    if (!updatedStartDate) {
      problems.updatedStartDate = true;
      problemMessages.push('Missing start date. You must specify the date that this value should go into effect.');
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

  getDataProcessedToSubmit() {
    const { indexOfSchedEntryToEdit, valueSchedule, jobId } = this.props;
    const { updatedStartDate } = this.state;
    const updates = {
      changeDate: [{
        id: valueSchedule[indexOfSchedEntryToEdit]._id.toString(),
        startDate: updatedStartDate
      }]
    };
    return { jobId, updates };
  };

  submit(event) {
    event.preventDefault();
    const { settingName, settingDisplayName, valueSchedule, indexOfSchedEntryToEdit } = this.props;
    const { hasWarning, updatedStartDate } = this.state;
    let response, secondsUntilRedirect;
    this.setSubmissionProcessingState()
    .then(() => {
      const { problems, problemMessages } = this.getInputProblems();
      if (problemMessages && problemMessages.length > 0) {
        throw { problems, messages: problemMessages };
      }
      const oldStartDate = valueSchedule[indexOfSchedEntryToEdit].startDate;
      let _warningInfo = (
        hasWarning ? {} : getDateChangeUpdateWarnings(oldStartDate, updatedStartDate, valueSchedule, settingDisplayName)
      );
      if (_warningInfo.hasWarning) {
        throw {
          isWarning: true,
          messages: _warningInfo.warningMessages
        };
      }
      const submissionData = this.getDataProcessedToSubmit();
      return api.jobs.updateSetting(settingName, submissionData);
    })
    .then(res => {
      response = res;
      secondsUntilRedirect = secondsToDelayRedirect;
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
      const entryId = valueSchedule[indexOfSchedEntryToEdit]._id;
      return this.props.setEntryToEditById(entryId);
    })
    .then(() => {
      currentJobService.setCurrentJob(response.data);
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
    this.setState(getStartingState());
  };

  componentDidUpdate(prevProps) {
    const { indexOfSchedEntryToEdit, valueSchedule } = this.props;
    const prevIndex = prevProps.indexOfSchedEntryToEdit;
    const currentEntryId = (
      (indexOfSchedEntryToEdit || indexOfSchedEntryToEdit === 0) &&
      valueSchedule[indexOfSchedEntryToEdit]._id.toString()
    );
    const prevEntryId = (prevIndex || prevIndex === 0) && prevProps.valueSchedule[prevIndex]._id.toString();
    if (currentEntryId !== prevEntryId) this.reset();
  };

  render() {
    const { reset, submit, changeHandlerFactory, handleDatepickerPopperToggle } = this;
    const {
      isActive, closeModal, settingDisplayName, valueSchedule, indexOfSchedEntryToEdit, inputRef
    } = this.props;
    const {
      hasSuccess,
      hasProblem,
      hasWarning,
      problems,
      problemMessages,
      showMessage,
      secondsUntilRedirect,
      updatedStartDate,
      isLoading,
      warningMessages,
      messagesAreaMinHeight
    } = this.state;

    if (!isActive) {
      return <></>;
    }

    const { dateRangeShortText, valueSimpleText, startDate } = valueSchedule[indexOfSchedEntryToEdit] || {};

    const closeMessage = () => this.setState({ showMessage: false });

    const lowCaseSettingName = settingDisplayName.toLowerCase();

    const style = getStyle(messagesAreaMinHeight);

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title={`Change ${settingDisplayName} Schedule Entry Start Date`}
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
              disabled={isLoading || hasSuccess || !updatedStartDate }
              isSubmit
              {...{
                formId,
                isLoading
              }}
            >
              {hasWarning ? 'Yes, Continue' : 'Submit'}
            </Button>
          </>
        }
      >
        <form id={formId}>
          <div style={style.messagesArea}>
            {showMessage && !hasProblem && !hasSuccess && !hasWarning && (
              <Notification theme="info" close={closeMessage}>
                <NotificationText isLast>
                  To change the date on which this {lowCaseSettingName} value takes effect, enter the new date below.
                </NotificationText>
              </Notification>
            )}
            {showMessage && problemMessages.length > 0 && (
              <Notification theme="danger" close={closeMessage} messages={problemMessages} />
            )}
            {showMessage && hasWarning && warningMessages.length > 0 && (
              <Notification theme="warning" messages={warningMessages} />
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
            <TagGroup align="center" isInline>
              <Tag theme="info" size={6}>
                Time Period:
              </Tag>
              <Tag theme="info light" size={6}>
                {dateRangeShortText}
              </Tag>
            </TagGroup>
            <TagGroup align="center" isInline>
              <Tag theme="info" size={6}>
                Current Value:
              </Tag>
              <Tag theme="info light" size={6}>
                {valueSimpleText}
              </Tag>
            </TagGroup>
          </div>
          <DateInput
            propName="updatedStartDate"
            value={updatedStartDate}
            {...{
              changeHandlerFactory,
              formId,
              inputRef
            }}
            label="Start Date:"
            placeholder="Type or select date..."
            helpText="When does the new value go into effect? Select the first day that the new setting value applies."
            labelStyle={style.label}
            hasProblem={problems && problems.updatedStartDate}
            isActive={!isLoading && !hasSuccess && !hasWarning}
            datePickerProps={{
              popperPlacement: 'top-start',
              onCalendarOpen: () => handleDatepickerPopperToggle(true),
              onCalendarClose: () => handleDatepickerPopperToggle(false)
            }}
            openToDate={startDate}
          />
        </form>
      </ModalSkeleton>
    );
  };
}

export default ChangeDateModal;