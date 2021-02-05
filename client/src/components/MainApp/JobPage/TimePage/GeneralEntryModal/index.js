import React, { Component } from 'react';
import getStyle from './style';
import { currentJobTimeService } from '../../../../../data';
import {
  api,
  bindFormMethods,
  getTimeInputStartingValue,
  isTimeSegmentInputIncomplete,
  processTimeSegmentInput,
  findSegmentsFromSegmentInfo,
  bindTimeSegFormMethodsAndRefs
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
    const { weeks, newSegmentInfo, newSegmentsInfo } = response.data;
    currentJobTimeService.setValue(weeks);
    this.setState({
      justAddedSegmentsInfo: [
        ...(newSegmentsInfo || [newSegmentInfo]),
        ...this.state.justAddedSegmentsInfo
      ]
    });
  };

  updateJustAdded(updatedSegments) {
    
  };

  resetJustAdded() {
    this.setState({ justAdded: [] });
  };

  render() {
    const { reset, submit, resetJustAdded } = this;
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

    console.log('RAW JUST ADDED `\\-\\v \n', justAddedSegmentsInfo)
    const justAdded = findSegmentsFromSegmentInfo(justAddedSegmentsInfo, job.time.weeks);
    console.log(justAdded)
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
        extraPrecedingBodyContent={hasJustAdded && (
          <JustAdded
            {...{
              justAdded,
              toggleDeleteSegmentModal,
              windowWidth,
              toggleEditSegmentModal
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
          <TimeSegmentInputs formMgmtComp={this} {...{ formId }} />
        </form>
      </ModalSkeleton>
    );
  };
}

export default EntryModal;
