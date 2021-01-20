import React, { Component } from 'react';
import getStyle from './style';
import { currentJobTimeService } from '../../../../../data';
import {
  api,
  constants,
  bindFormMethods,
  inputProblemsGetterFactory,
  getTimeInputStartingValue,
  hasBlankInput,
  getNumDaysSpannedBySegment,
  processTimeSegmentInput,
  findSegmentsFromSegmentInfo
} from './utilities';
import ModalSkeleton from '../../../../ModalSkeleton';
import { FormMessages } from '../../../../formPieces';
import Button from '../../../../Button';
import DateTimeInput from './DateTimeInput';
import JustAdded from './JustAdded';
import ModalSectionTitle from './ModalSectionTitle';

const { datePickerPopperHeight } = constants;

const formId = 'general-time-entry-add-segment-form';
const inputFieldMarginBottom = '0.75rem'; // matches Bulma style for `.field:not(:last-child)`
const sectionLabelMarginBottom = '0.5rem'; // matches Bulma style for `.label:not(:last-child)`, almost ("em"->"rem") 

class EntryModal extends Component {
  constructor(props) {
    super(props);
    this.getInputProblems = inputProblemsGetterFactory().bind(this);
    bindFormMethods(this, { hasCountdown: false });
    this.resetJustAdded = this.resetJustAdded.bind(this);
    this.handleDatepickerPopperToggle = this.handleDatepickerPopperToggle.bind(this);
    this.firstInputArea = React.createRef();
    this.firstInputAreaLabel = React.createRef();
    this.state = {
      ...this.getStartingState(),
      justAddedSegmentsInfo: []
    };
  };

  getUniqueStartingState() {
    return {
      startDate: null,
      endDate: null,
      startTime: getTimeInputStartingValue(),
      endTime: getTimeInputStartingValue(),
      messagesAreaMinHeight: undefined
    };
  };

  afterChange(propName) {
    const { startDate, endDate, hasBeenSubmitted } = this.state;
    console.log(propName + '\n', this.state[propName])
    if (propName === 'startDate' && startDate && !endDate) {
      this.setState({ endDate: { ...startDate }});
    }
    else if (propName ==='endDate' && endDate && !startDate) {
      this.setState({ startDate: { ...endDate }});
    }
    if (hasBeenSubmitted) {
      this.setState(this.getInputProblems());
    }
  };

  handleDatepickerPopperToggle(isActiveAfterToggle, isStartDate) {
    // need to make space for datepicker popper above date input.
    const sectionLabelHeight = this.firstInputAreaLabel.current.clientHeight;
    console.log('sectionLabelHeight\n', sectionLabelHeight);
    let roomAvailableBelowMsgArea = `${sectionLabelHeight}px + ${sectionLabelMarginBottom}`;
    console.log('roomAvailableBelowMsgArea\n', roomAvailableBelowMsgArea);
    if (!isStartDate) {
      const firstSectionHeight = this.firstInputArea.current.clientHeight;
      console.log('firstSectionHeight\n', firstSectionHeight)
      roomAvailableBelowMsgArea += ` + ${firstSectionHeight}px + ${inputFieldMarginBottom}`;
      console.log('roomAvailableBelowMsgArea\n', roomAvailableBelowMsgArea)
    }
    this.setState({
      messagesAreaMinHeight: isActiveAfterToggle ? (
        `calc(${datePickerPopperHeight} - (${roomAvailableBelowMsgArea}))`
      ) : (
        undefined
      )
    });
  };

  getWarnings() {
    const { job } = this.props;
    const timezone = job.time.sessionTimezone;
    let warnings = {
      hasWarning: false,
      warningMessages: []
    };
    if (this.state.hasWarning) {
      return warnings;
    }
    const numDaysSpanned = getNumDaysSpannedBySegment(this.state, timezone, job);
    if (numDaysSpanned > 1) {
      warnings.hasWarning = true;
      warnings.warningMessages.push(
        `This time segment spans accross ${numDaysSpanned} work days.`,
        `It will be automatically split into ${numDaysSpanned} time segments.`,
        'Are you sure you want to continue?'
      );
    }
    return warnings;
  };

  processAndSubmitData() {
  /* TO DO:
    Split segment if it spans multiple days.
    Consider adding new api route for multiple segments, or submit each segment in succession or parallel while waiting on results
  */
    const { job } = this.props;
    const timezone = job.time.sessionTimezone;
    const processedInput = processTimeSegmentInput(this.state, timezone, job);
    const namesSuffix = processedInput.isSplit ? 's' : '';
    const segDataPropName = `segment${namesSuffix}`;
    return api.time[`addSegment${namesSuffix}`]({
      jobId: job._id,
      [segDataPropName]: processedInput[segDataPropName]
    });
  };

  processSuccessResponse(response) {
    console.log(response)
    const { data: { job, newSegmentInfo } } = response;
    currentJobTimeService.setValue(job && job.weeks);
    this.setState({
      justAddedSegmentsInfo: [ newSegmentInfo, ...this.state.justAddedSegmentsInfo ]
    });
  };

  resetJustAdded() {
    this.setState({ justAddedSegmentsInfo: [] });
  };

  render() {
    const {
      reset,
      submit,
      resetJustAdded,
      changeHandlerFactory,
      firstInputArea,
      firstInputAreaLabel,
      handleDatepickerPopperToggle
    } = this;
    const {
      isActive, closeModal, inputRef, job, toggleDeleteSegmentModal, windowWidth
    } = this.props;
    const {
      hasSuccess,
      hasProblem,
      hasWarning,
      problemMessages,
      showMessage,
      isLoading,
      warningMessages,
      problems,
      messagesAreaMinHeight,
      justAddedSegmentsInfo
    } = this.state;

    const justAdded = findSegmentsFromSegmentInfo(justAddedSegmentsInfo, job.time.weeks);
    const isFormIncomplete = hasBlankInput(this.state);
    const hasJustAdded = !!(justAdded && justAdded.length);

    const reverseWarning = () => this.setState({ hasWarning: false });
    const getInputProps = propName => ({
      propName,
      problems: problems[propName],
      hasProblem: !!problems[propName],
      value: this.state[propName]
    });

    const isUserActionAllowed = !isLoading && !hasWarning && !hasSuccess;
    const commonAttrs = {
      changeHandlerFactory,
      formId,
      isActive: isUserActionAllowed,
      handleDatepickerPopperToggle,
      inputFieldMarginBottom,
      sectionLabelMarginBottom
    };

    const style = getStyle(messagesAreaMinHeight);

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title="General Time Entry"
        isCloseButtonDisabled={isLoading}
        extraPrecedingBodyContent={hasJustAdded && (
          <JustAdded
            {...{
              justAdded,
              toggleDeleteSegmentModal,
              windowWidth
            }}
          />
        )}
        sectionStyles={{ precedingBody: style.extraPrecedingBody }}
        footerContent={
          <>
            <Button
              onClick={() => {
                reset();
                closeModal();
                resetJustAdded();
              }}
              disabled={isLoading}
            >
              {hasSuccess ? 'Done' : 'Cancel'}
            </Button>
            {hasWarning && (
              <Button
                theme="info"
                onClick={reverseWarning}
                disabled={isLoading || hasSuccess}
              >
                Edit Form:
              </Button>
            )}
            <Button
              theme={hasWarning ? 'warning' : 'primary'}
              onClick={hasSuccess ? reset : submit}
              disabled={isLoading || isFormIncomplete}
              isSubmit={!hasSuccess}
              formId={hasSuccess ? undefined : formId}
              {...{ isLoading }}
            >
              {
                (hasWarning && 'Yes, Add Segments') ||
                (hasSuccess && 'Enter More Time') ||
                'Submit'
              }
            </Button>
          </>
        }
      >
        <form id={formId}>
          <div style={style.messagesArea}>
            {hasJustAdded && !(justAdded.length === 1 && hasSuccess) && (
              <ModalSectionTitle>
                Add Time Segment
              </ModalSectionTitle>
            )}
            <FormMessages
              {...{
                hasSuccess,
                hasProblem,
                hasWarning,
                problemMessages,
                warningMessages,
              }}
              showMessage={showMessage && (!hasJustAdded || hasSuccess || hasProblem || hasWarning)}
              infoMessages={[
                'Use the form below to record your time worked one time segment at a time.',
                'Enter the start (clock-in) time and end (clock-out) time for each segment.'
              ]}
              successMessages={[
                'Time segment successfully added.',
                'Would you like to enter more time?'
              ]}
              closeMessage={() => this.setState({ showMessage: false })}
            />
          </div>
          <div ref={firstInputArea} style={style.firstInputArea}>
            <DateTimeInput
              sectionLabel="Time Segment Start (Clock-In)"
              timeInputProps={getInputProps('startTime')}
              dateInputProps={getInputProps('startDate')}
              {...commonAttrs}
              sectionName="segment-start"
              {...{ inputRef }}
              labelAreaRef={firstInputAreaLabel}
            />
          </div>
          <DateTimeInput
            sectionLabel="Time Segment End (Clock-Out)"
            timeInputProps={getInputProps('endTime')}
            dateInputProps={getInputProps('endDate')}
            {...commonAttrs}
            sectionName="segment-end"
            isLast
          />
        </form>
      </ModalSkeleton>
    );
  };
}

export default EntryModal;
