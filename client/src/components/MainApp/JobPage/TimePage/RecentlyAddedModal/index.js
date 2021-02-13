import React, { Component } from 'react';
import getStyle from './style';
import {
  formatMyDate,
  formatSegmentTimes,
  formatDuration,
  findRecentlyAddedSegs,
  getInputProblems,
  extractInputValues,
  processInputChange,
  getPeriodDurationInMsec,
  getTimePeriodInputsStartingValue
} from './utilities';
// import { SelectInput } from '../../../../formPieces';
import Button from '../../../../Button';
import Notification from '../../../../Notification';
import ModalSkeleton from '../../../../ModalSkeleton';
import TimePeriodInput from './PeriodInput';
import Segments from './Segments';

const getStartingState = () => ({
  ...getTimePeriodInputsStartingValue(),
  showMessage: false,
  recentlyAddedSegments: null,
  periodDurationInMsec: null
});

class RecentlyAddedModal extends Component {
  constructor(props) {
    super(props);
    this.inputChangeHandlerFactory = this.inputChangeHandlerFactory.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      ...getStartingState()
    };
  };

  inputChangeHandlerFactory(propName) {
    return ({ target }) => {
      let stateUpdates = processInputChange(propName, target.value);
      const periodDurationInMsec = getPeriodDurationInMsec({ ...this.state, ... stateUpdates });
      if (periodDurationInMsec) {
        stateUpdates.recentlyAddedSegments = findRecentlyAddedSegs(this.props.job.time.weeks, periodDurationInMsec);
      }
      this.setState({ ...stateUpdates, periodDurationInMsec }, () => console.log(this.state));
    };
  };

  reset() {
    this.setState(getStartingState());
  };

  render() {
    const { reset, inputChangeHandlerFactory } = this;
    const { isActive, closeModal, disabled } = this.props;
    const { showMessage, recentlyAddedSegments } = this.state;
    const inputValues = extractInputValues(this.state);

    const closeMessage = () => this.setState({ showMessage: false });

    if (!isActive ) {
      return <></>;
    }

    const style = getStyle();

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        isCloseButtonDisabled={disabled}
        title="Recently Added Time"
        footerContent={
          <Button
            onClick={() => {
              reset();
              closeModal();
            }}
            {...{ disabled }}
          >
            Done
          </Button>
        }
      >
        {showMessage && (
          <Notification
            theme="info"
            messages={[
              'The most recently added time segments are listed below beginning with the most recent.',
              'Use the controls below to adjust how far back in time to look.'
            ]}
            close={closeMessage}
          />
        )}
        <TimePeriodInput
          changeHandlerFactory={inputChangeHandlerFactory}
          {...inputValues}
          isActive={!disabled}
        />
        <Segments
          segments={recentlyAddedSegments}
        />
      </ModalSkeleton>
    );
  };
}

export default RecentlyAddedModal;
