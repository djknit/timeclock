import React, { Component } from 'react';
import {
  api, 
  constants,
  changeHandlerFactoryFactory,
  getDateChangeUpdateWarnings,
  setSubmissionProcessingStateFactory,
  submitFactory,
  getStartingStateFactory,
  resetFactory
} from '../utilities';
import { currentJobService } from '../../../../../data';
import getStyle from './style';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Tag, { TagGroup } from '../../../../Tag';
import { DateInput, FormMessages } from '../../../../formPieces';

const { secondsToDelayRedirect } = constants;

const formId = 'change-job-setting-date-form';

class ChangeDateModal extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory().bind(this);
    this.getStartingState = getStartingStateFactory().bind(this);
    this.handleDatepickerPopperToggle = this.handleDatepickerPopperToggle.bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.setSubmissionProcessingState = setSubmissionProcessingStateFactory().bind(this);
    this.processAndSubmitData = this.processAndSubmitData.bind(this);
    this.getWarnings = this.getWarnings.bind(this);
    this.processSuccessResponse = this.processSuccessResponse.bind(this);
    this.afterSuccessCountdown = this.afterSuccessCountdown.bind(this);
    this.submit = submitFactory().bind(this);
    this.reset = resetFactory().bind(this);
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    return {
      updatedStartDate: null,
      messagesAreaMinHeight: undefined
    };
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
      problemMessages.push(
        'Missing start date. You must specify the date that this value should go into effect.'
      );
    }
    const hasProblem = problemMessages.length > 0;
    return { problems, problemMessages, hasProblem };
  };

  processAndSubmitData() {
    const { indexOfSchedEntryToEdit, valueSchedule, jobId, settingName } = this.props;
    const { updatedStartDate } = this.state;
    const updates = {
      changeDate: [{
        id: valueSchedule[indexOfSchedEntryToEdit]._id.toString(),
        startDate: updatedStartDate
      }]
    };
    return api.jobs.updateSetting(settingName, { jobId, updates });
  };

  getWarnings() {
    const { valueSchedule, indexOfSchedEntryToEdit, settingDisplayName } = this.props;
    const { hasWarning, updatedStartDate } = this.state;
    const oldStartDate = valueSchedule[indexOfSchedEntryToEdit].startDate;
    return hasWarning ? (
      { hasWarning: false, warningMessages: [] }
    ) : (
      getDateChangeUpdateWarnings(oldStartDate, updatedStartDate, valueSchedule, settingDisplayName)
    );
  };

  processSuccessResponse(response) {
    const { valueSchedule, indexOfSchedEntryToEdit, setEntryToEditById } = this.props;
    const entryId = valueSchedule[indexOfSchedEntryToEdit]._id;
    return setEntryToEditById(entryId)
    .then(() => {
      return currentJobService.setCurrentJob(response.data);
    });
  };

  afterSuccessCountdown() {
    this.props.closeModal();
  };

  // submit(event) {
  //   event.preventDefault();
  //   const { valueSchedule, indexOfSchedEntryToEdit } = this.props;
  //   let response, secondsUntilRedirect;
  //   this.setSubmissionProcessingState()
  //   .then(() => {
  //     const { problems, problemMessages } = this.getInputProblems();
  //     if (problemMessages && problemMessages.length > 0) {
  //       throw { problems, messages: problemMessages };
  //     }
  //     const { hasWarning, warningMessages } = this.getWarnings();
  //     if (hasWarning) {
  //       throw {
  //         isWarning: true,
  //         messages: warningMessages
  //       };
  //     }
  //     return this.processAndSubmitData();
  //   })
  //   .then(res => {
  //     response = res;
  //     secondsUntilRedirect = secondsToDelayRedirect;
  //     this.setState({
  //       ...genericFormStates.success,
  //       secondsUntilRedirect
  //     });
  //     const entryId = valueSchedule[indexOfSchedEntryToEdit]._id;
  //     return this.processSuccessResponse && this.processSuccessResponse();
  //   })
  //   .then(() => {
  //     const intervalId = setInterval(
  //       () => {
  //         secondsUntilRedirect -= stepSizeOfRedirectDelay;
  //         this.setState({ secondsUntilRedirect });
  //         if (secondsUntilRedirect <= 0) {
  //           clearInterval(intervalId);
  //           if (this.afterSuccessCountdown) this.afterSuccessCountdown();
  //           this.reset();
  //         }
  //       },
  //       1000 * stepSizeOfRedirectDelay
  //     );
  //   }) 
  //   .catch(err => {
  //     const { isWarning } = err || {};
  //     this.props.catchApiUnauthorized(err);
  //     const errorData = (err && err.response && err.response.data) || err || {};
  //     let { problems, messages = [] } = errorData;
  //     const stateType = isWarning ? 'warning' : 'problem';
  //     let stateUpdates = {
  //       problemMessages: [],
  //       warningMessages: [],
  //       problems: problems || {},
  //       ...genericFormStates[stateType]
  //     };
  //     stateUpdates[`${stateType}Messages`] = messages;
  //     this.setState(stateUpdates);
  //   })
  // };

  // reset() {
  //   this.setState(getUniqueStartingState());
  // };

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

    const lowCaseSettingName = settingDisplayName.toLowerCase();

    const style = getStyle(messagesAreaMinHeight);

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal,
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
              {hasSuccess ? "Close" : "Cancel"}
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
              theme={
                (hasSuccess && "success") ||
                (hasWarning && "warning") ||
                "primary"
              }
              onClick={submit}
              disabled={isLoading || hasSuccess || !updatedStartDate}
              isSubmit
              {...{
                formId,
                isLoading,
              }}
            >
              {hasWarning ? "Yes, Continue" : "Submit"}
            </Button>
          </>
        }
      >
        <form id={formId}>
          <div style={style.messagesArea}>
            <FormMessages
              {...{
                showMessage,
                hasSuccess,
                problemMessages,
                hasWarning,
                hasProblem,
                warningMessages
              }}
              infoMessages={[
                `To change the date on which this ${lowCaseSettingName} vaue takes effect, enter the new date below.`,
              ]}
              successMessages={[
                `You successfully changed the start date for this ${lowCaseSettingName} value.`,
              ]}
              successRedirect={{
                secondsToDelayRedirect,
                secondsRemaining: secondsUntilRedirect,
                messageFragment: 'This dialog box will close',
              }}
              closeMessage={() => this.setState({ showMessage: false })}
            />
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
              inputRef,
            }}
            label="Start Date:"
            placeholder="Type or select date..."
            helpText="When does the new value go into effect? Select the first day that the new setting value applies."
            labelStyle={style.label}
            hasProblem={problems && problems.updatedStartDate}
            isActive={!isLoading && !hasSuccess && !hasWarning}
            datePickerProps={{
              popperPlacement: "top-start",
              onCalendarOpen: () => handleDatepickerPopperToggle(true),
              onCalendarClose: () => handleDatepickerPopperToggle(false),
            }}
            openToDate={startDate}
          />
        </form>
      </ModalSkeleton>
    );
  };
}

export default ChangeDateModal;