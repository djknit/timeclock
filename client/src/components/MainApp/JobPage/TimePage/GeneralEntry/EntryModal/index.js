import React, { Component } from 'react';
import {
  api,
  constants,
  bindFormMethods,
  getTimeInputProblems
} from '../../utilities';
import ModalSkeleton from '../../../../../ModalSkeleton';
import { FormMessages } from '../../../../../formPieces';
import Button from '../../../../../Button';

const formId = 'general-time-entry-add-segment-form';

class EntryModal extends Component {
  constructor(props) {
    super(props);
    this.resetJustAdded = this.resetJustAdded.bind(this);
    bindFormMethods(this, { hasCountdown: false });
    this.firstInputArea = React.createRef();
    this.state = {
      ...this.getStartingState(),
      justAdded: []
    };
  };

  getUniqueStartingState() {
    return {
      startDate: null,
      endDate: null,
      startTime: getTimeInputStartingValue(),
      endTime: getTimeInputStartingValue()
    };
  };

  afterChange(propName) {
    const { startDate, endDate, hasBeenSubmitted } = this.state;
    if (propName === 'startDate' && !endDate) {
      this.setState({ endDate: { ...startDate }});
    }
    else if (propName ==='endDate' && !startDate) {
      this.setState({ startDate: { ...endDate }});
    }
    if (hasBeenSubmitted) {
      this.setState(this.getInputProblems());
    }
  };

  getInputProblems() {
    const { startDate, endDate, startTime, endTime } = this.state;
    let problems = {};
    let problemMessages = [];
    if (!startDate) {
      problems.startDate = true;
      problemMessages.push('You must enter the date that the time segment begins.');
    }
    if (!endDate) {
      problems.endDate = true;
      problemMessages.push('You must enter the date that the time segment ends.');
    }
    problems.startTime = getTimeInputProblems(startTime, problemMessages);
    problems.endTime = getTimeInputProblems(endTime, problemMessages);
    return { problems, problemMessages };
  };

  processAndSubmitData() {
    const { startDate, endDate, startTime, endTime } = this.state;
    return api.time.addSegment({ 

    });
  };

  processSuccessResponse(response) {
    console.log(response);
  };

  resetJustAdded() {
    this.setState({ justAdded: [] });
  };

  render() {
    const { reset, submit, resetJustAdded } = this;
    const { isActive, closeModal } = this.props;
    const {
      hasSuccess,
      hasProblem,
      hasWarning,
      problemMessages,
      showMessage,
      secondsUntilRedirect,
      isLoading,
      warningMessages
    } = this.state;

    const isFormIncomplete = false // needs set once inputs are added

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title="Enter Time"
        isCloseButtonDisabled={isLoading}
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
            <Button
              theme="primary"
              onClick={hasSuccess ? reset : submit}
              disabled={isLoading || isFormIncomplete}
              isSubmit={!hasSuccess}
              formId={hasSuccess ? undefined : formId}
              {...{
                isLoading
              }}
            >
              {hasSuccess ? 'Enter More Time' : 'Submit'}
            </Button>
          </>
        }
      >
        <FormMessages

        />
      </ModalSkeleton>
    );
  };
}

export default EntryModal;

function getTimeInputStartingValue() {
  return {
    is24hr: false,
    amPm: 'am',
    hour: undefined,
    minute: undefined
  };
}
