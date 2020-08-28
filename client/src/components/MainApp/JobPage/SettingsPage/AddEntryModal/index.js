import React, { Component } from 'react';
import {
  api,
  constants,
  addWageInputRefs,
  extractWageInputRefs,
  getJobSettingInputProblems,
  getSettingInputInitialValues,
  processJobSettingInputValue,
  formatMyDate,
  getAddUpdateWarnings,
  bindCommonFormMethods
} from '../utilities';
import { currentJobService } from '../../../../../data';
import getStyle from './style';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import { DateInput, FormMessages } from '../../../../formPieces';
import SettingValueInput from '../SettingValueInput';
import { addCollapsing } from '../../../../higherOrder';

const { secondsToDelayRedirect } = constants;

const formId = 'add-job-setting-schedule-entry';

class _AddEntryModal_needsCollapsing extends Component {
  constructor(props) {
    super(props);
    this.handleDatepickerPopperToggle = this.handleDatepickerPopperToggle.bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.processAndSubmitData = this.processAndSubmitData.bind(this);
    this.processSuccessResponse = this.processSuccessResponse.bind(this);
    this.afterSuccessCountdown = this.afterSuccessCountdown.bind(this);
    bindCommonFormMethods(this);
    addWageInputRefs(this);
    this.firstInputArea = React.createRef();
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    const jobSettingInitialInputValues = getSettingInputInitialValues();
    return {
      settingValue: jobSettingInitialInputValues[this.props.settingName],
      startDate: null,
      messagesAreaMinHeight: undefined
    };
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
    const hasProblem = problemMessages.length > 0;
    return { problems, problemMessages, hasProblem };
  };

  processAndSubmitData() {
    const { settingName, jobId } = this.props;
    const { startDate, settingValue } = this.state;
    const updates = {
      add: [{
        startDate,
        value: processJobSettingInputValue(settingName, settingValue)
      }]
    };
    return api.jobs.updateSetting(settingName, { jobId, updates });
  };

  getWarnings() {
    const { valueSchedule, settingDisplayName } = this.props;
    const { hasWarning, startDate } = this.state;
    return hasWarning ? (
      { hasWarning: false, warningMessages: [] }
    ) : (
      getAddUpdateWarnings(startDate, valueSchedule, settingDisplayName)
    );
  };

  processSuccessResponse(response) {
    return currentJobService.setCurrentJob(response.data);
  };

  afterSuccessCountdown() {
    this.props.closeModal();
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
      contentToggle,
      inputRef
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

    if (!isActive) {
      return <></>;
    }

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
              disabled={isLoading || hasSuccess || !startDate || (!settingValue && settingValue !== 0)}
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
            <FormMessages
              {...{
                showMessage,
                hasSuccess,
                problemMessages,
                hasWarning
              }}
              hasProblem={hasProblem}
              infoMessages={[
                `Enter the new ${lowCaseSettingName} value and the date on which that value goes into effect below.`
              ]}
              successMessages={[
                `You successfully added a new ${lowCaseSettingName} value to the schedule.`
              ]}
              warningMessages={[
                <>
                  You already have a {lowCaseSettingName} value with the same start date ({formatMyDate(startDate)}).
                </>,
                <>Are you sure you want to replace the existing schedule value?</>
              ]}
                
              successRedirect={{
                secondsToDelayRedirect,
                secondsRemaining: secondsUntilRedirect,
                messageFragment: 'This dialog box will close'
              }}
              closeMessage={() => this.setState({ showMessage: false })}
            />
          </div>
          <div ref={firstInputArea} style={style.firstInputArea}>
            <SettingValueInput
              {...getCommonFormAttrs('settingValue')}
              {...{
                wageInputRefs,
                inputRef
              }}
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