import React, { Component } from 'react';
import {
  api,
  constants,
  changeHandlerFactoryFactory,
  convertSettingValueToFormData,
  addWageInputRefs,
  extractWageInputRefs,
  getJobSettingInputProblems,
  processJobSettingInputValue,
  setSubmissionProcessingStateFactory,
  genericFormStates
} from '../utilities';
import { currentJobService } from '../../../../../data';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Tag, { TagGroup } from '../../../../Tag';
import { FormMessages } from '../../../../formPieces';
import SettingValueInput from '../SettingValueInput';
import { addCollapsing } from '../../../../higherOrder';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

const formId = 'edit-job-setting-value-form';
function getStartingState(settingName, currentValue) {
  return {
    ...genericFormStates.starting,
    updatedValue: convertSettingValueToFormData(currentValue, settingName)
  };
}

class _EditValueModal_needsCollapsing extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory(this.afterChange).bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.setSubmissionProcessingState = setSubmissionProcessingStateFactory().bind(this);
    this.getDataProcessedToSubmit = this.getDataProcessedToSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    addWageInputRefs(this);
    this.state = getStartingState();
  };

  // possibly mostly the same for many
  afterChange() {
    if (this.state.hasBeenSubmitted) {
      this.setState(this.getInputProblems());
    }
  };

  // unique;
    // possibly should be related to constructor or at least share some values such as propNames
    // also tied to processing for submit
  getInputProblems() {
    const { settingName } = this.props;
    const { updatedValue } = this.state;
    let problems = {};
    let problemMessages = [];
    problems.updatedValue = getJobSettingInputProblems(settingName, updatedValue, problemMessages);
    return { problems, problemMessages };
  };

  // unique
  getDataProcessedToSubmit() {
    const { indexOfSchedEntryToEdit, valueSchedule, settingName, jobId } = this.props;
    const { updatedValue } = this.state;
    const updates = {
      edit: [{
        id: valueSchedule[indexOfSchedEntryToEdit]._id.toString(),
        value: processJobSettingInputValue(settingName, updatedValue)
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
      if (problemMessages && problemMessages.length > 0) {
        throw { problems, messages: problemMessages };
      }
      const submissionData = this.getDataProcessedToSubmit();
      return api.jobs.updateSetting(settingName, submissionData);
    })
    .then(res => {
      let secondsUntilRedirect = secondsToDelayRedirect;
      this.setState({ ...genericFormStates.success, secondsUntilRedirect });
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
      console.log(err)
      this.props.catchApiUnauthorized(err);
      const errorData = (err && err.response && err.response.data) || err || {};
      let { problems, messages } = errorData;
      if (!problems) problems = { unknown: true };
      if (!messages) messages = ['An unknown problem has occurred.'];
      this.setState({
        problems,
        problemMessages: messages,
        ...genericFormStates.problem
      });
    });
  };

  reset() {
    const { indexOfSchedEntryToEdit, valueSchedule, settingName, wageContentToggle } = this.props;
    const currentValue = (
      (indexOfSchedEntryToEdit || indexOfSchedEntryToEdit === 0) &&
      valueSchedule[indexOfSchedEntryToEdit].value
    );
    this.setState(getStartingState(settingName, currentValue));
    if (wageContentToggle && wageContentToggle.reset) {
      wageContentToggle.reset();
    }
  };

  componentDidUpdate(prevProps) {
    const {
      indexOfSchedEntryToEdit, valueSchedule, isActive, windowWidth, wageContentToggle, settingName
    } = this.props;
    // checking if sched index has changed to see if form needs reset
    const previousIndex = prevProps.indexOfSchedEntryToEdit;
    const currentEntryId = (
      (indexOfSchedEntryToEdit || indexOfSchedEntryToEdit === 0) &&
      valueSchedule[indexOfSchedEntryToEdit]._id
    );
    const previousEntryId = (
      (previousIndex || previousIndex === 0) &&
      prevProps.valueSchedule[previousIndex]._id.toString()
    );
    if (currentEntryId !== previousEntryId) this.reset();
    // checking if toggle is active and needs set or cleared
    const shouldToggleBeSet = isActive && settingName === 'wage' && !!this.state.updatedValue;
    if (
      shouldToggleBeSet &&
      (!wageContentToggle.isHeightSet || windowWidth !== prevProps.windowWidth || !prevProps.isActive)
    ) {
      wageContentToggle.setHeight();
    }
    else if (wageContentToggle.isHeightSet && !shouldToggleBeSet) {
      wageContentToggle.clearHeight();
    }
  };

  render() {
    const { reset, submit, changeHandlerFactory } = this;
    const {
      isActive,
      closeModal,
      settingDisplayName,
      valueSchedule,
      indexOfSchedEntryToEdit,
      settingName,
      wageContentToggle,
      inputRef
    } = this.props;
    const {
      hasSuccess,
      hasProblem, 
      problems,
      problemMessages,
      showMessage,
      secondsUntilRedirect,
      updatedValue,
      isLoading
    } = this.state;

    if (!isActive) {
      return <></>;
    }

    const {
      valueSimpleText, dateRangeText, dateRangeShortText
    } = valueSchedule[indexOfSchedEntryToEdit];

    const lowCaseSettingName = settingDisplayName.toLowerCase();

    const wageInputRefs = extractWageInputRefs(this);

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title={`Edit ${settingDisplayName} Schedule Entry Value`}
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
              disabled={isLoading || hasSuccess || (!updatedValue && updatedValue !== 0)}
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
          <FormMessages
            {...{
              showMessage,
              hasSuccess,
              problemMessages
            }}
            hasProblem={hasProblem}
            infoMessages={[
              <>You are editing the {lowCaseSettingName} for {dateRangeText}.</>,
              <>Enter the new value below.</>
            ]}
            successMessages={[
              <>You successfully updated the {lowCaseSettingName} for {dateRangeText}.</>
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
          <SettingValueInput
            propName="updatedValue"
            value={updatedValue}
            {...{
              settingName,
              changeHandlerFactory,
              formId,
              wageInputRefs,
              wageContentToggle,
              inputRef
            }}
            problems={problems && problems.updatedValue}
            isActive={!isLoading && !hasSuccess}
            label={`New ${settingDisplayName} Value:`}
          />
        </form>
      </ModalSkeleton>
    );
  };
}

const EditValueModal = addCollapsing(
  _EditValueModal_needsCollapsing, 'wageContentToggle', true, true
);

export default EditValueModal;