import React, { Component } from 'react';
import getStyle from './style';
import { currentJobTimeService } from '../../../../../data';
import {
  api,
  bindFormMethods,
  getTimeInputStartingValue,
  isTimeSegmentInputIncomplete,
  processTimeSegmentInput,
  findSegmentsFromSegmentInfos,
  bindTimeSegFormMethodsAndRefs,
  getUpdatedSegInfos,
  getSegInfoForNewSegs,
  extractFormContainerRef
} from './utilities';
import ModalSkeleton from '../../../../ModalSkeleton';
import { FormMessages } from '../../../../formPieces';
import Button from '../../../../Button';
import TimeSegmentInputs from '../TimeSegmentInputs';
import JustAdded from './JustAdded';
import ModalSectionTitle from './ModalSectionTitle';

const formId = 'general-time-entry-add-segment-form';

class EntryModal extends Component {
  constructor(props) {
    super(props);
    this.applySegmentUpdateToJustAdded = this.applySegmentUpdateToJustAdded.bind(this);
    bindTimeSegFormMethodsAndRefs(this);
    bindFormMethods(this, { hasCountdown: false });
    this.resetJustAdded = this.resetJustAdded.bind(this);
    this.resetFormAfterSegmentAdded = this.resetFormAfterSegmentAdded.bind(this);
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

  processAndSubmitData() {
    const { job } = this.props;
    const timezone = job.time.sessionTimezone;
    const processedInput = processTimeSegmentInput(this.state, timezone);
    const namesSuffix = processedInput.isSplit ? 's' : '';
    const segDataPropName = `segment${namesSuffix}`;
    return api.time[`addSegment${namesSuffix}`]({
      jobId: job._id,
      [segDataPropName]: processedInput[segDataPropName]
    });
  };

  processSuccessResponse(response) {
    currentJobTimeService.setValue(response.data.weeks);
    this.setState({
      justAddedSegmentsInfo: [
        ...getSegInfoForNewSegs(response.data),
        ...this.state.justAddedSegmentsInfo
      ]
    });
  };

  applySegmentUpdateToJustAdded(updatedSegs) {
    this.setState({
      justAddedSegmentsInfo: getUpdatedSegInfos(
        updatedSegs, this.state.justAddedSegmentsInfo
      )
    });
  };

  resetJustAdded() {
    this.setState({ justAdded: [] });
  };

  resetFormAfterSegmentAdded() {
    this.setState({
      ...this.getStartingState(),
      showMessage: false
    });
  };

  render() {
    const {
      reset, submit, resetJustAdded, applySegmentUpdateToJustAdded, resetFormAfterSegmentAdded
    } = this;
    const {
      isActive,
      closeModal,
      job,
      toggleDeleteSegmentModal,
      windowWidth,
      toggleEditSegmentModal,
      disabled
    } = this.props;
    const {
      justAddedSegmentsInfo,
      hasSuccess,
      hasProblem,
      hasWarning,
      problemMessages,
      showMessage,
      isLoading,
      warningMessages,
      messagesAreaMinHeight,
    } = this.state;

    const justAdded = findSegmentsFromSegmentInfos(justAddedSegmentsInfo, job.time.weeks);
    const isFormIncomplete = isTimeSegmentInputIncomplete(this.state);
    const hasJustAdded = !!(justAdded && justAdded.length);
    const isFormDisabled = isLoading || disabled;
    const bodyRef = extractFormContainerRef(this);

    const reverseWarning = () => this.setState({ hasWarning: false });

    const style = getStyle(messagesAreaMinHeight);

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal,
          bodyRef
        }}
        title="General Time Entry"
        isCloseButtonDisabled={isFormDisabled}
        topBodyContent={hasJustAdded && (
          <JustAdded
            {...{
              justAdded,
              toggleDeleteSegmentModal,
              windowWidth,
              toggleEditSegmentModal,
              applySegmentUpdateToJustAdded,
              disabled,
            }}
          />
        )}
        bodyStyles={{ top: style.topBodySection }}
        footerContent={
          <>
            <Button
              onClick={() => {
                reset();
                closeModal();
                resetJustAdded();
              }}
              disabled={isFormDisabled}
            >
              {hasSuccess ? 'Done' : 'Cancel'}
            </Button>
            {hasWarning && (
              <Button
                theme="info"
                onClick={reverseWarning}
                disabled={hasSuccess || isFormDisabled}
              >
                Edit Form:
              </Button>
            )}
            <Button
              theme={hasWarning ? 'warning' : 'primary'}
              onClick={hasSuccess ? resetFormAfterSegmentAdded : submit}
              disabled={isFormDisabled || isFormIncomplete}
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
                disabled,
                showMessage
              }}
              infoMessages={[
                'Use the form below to record your time worked one time segment at a time.',
                'Enter the start (clock-in) time and end (clock-out) time for each segment.'
              ]}
              successMessages={[
                'Time segment successfully added.',
                'Would you like to enter more time?'
              ]}
              toggleMessage={shouldShowMsg => this.setState({ showMessage: shouldShowMsg })}
            />
          </div>
          <TimeSegmentInputs formMgmtComp={this} {...{ formId, disabled }} />
        </form>
      </ModalSkeleton>
    );
  };
}

export default EntryModal;
