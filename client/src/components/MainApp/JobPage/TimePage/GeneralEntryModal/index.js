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
  getSegInfoForNewSegs
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

  render() {
    const { reset, submit, resetJustAdded, applySegmentUpdateToJustAdded } = this;
    const {
      isActive,
      closeModal,
      job,
      toggleDeleteSegmentModal,
      windowWidth,
      toggleEditSegmentModal
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

    const reverseWarning = () => this.setState({ hasWarning: false });

    const style = getStyle(messagesAreaMinHeight);

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title="General Time Entry"
        isCloseButtonDisabled={isLoading}
        topBodyContent={hasJustAdded && (
          <JustAdded
            {...{
              justAdded,
              toggleDeleteSegmentModal,
              windowWidth,
              toggleEditSegmentModal,
              applySegmentUpdateToJustAdded
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
          <TimeSegmentInputs formMgmtComp={this} {...{ formId }} />
        </form>
      </ModalSkeleton>
    );
  };
}

export default EntryModal;
