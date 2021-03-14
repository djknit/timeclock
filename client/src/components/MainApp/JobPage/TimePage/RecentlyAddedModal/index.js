import React, { Component } from 'react';
import getStyle from './style';
import { currentJobService } from '../../../../../data';
import {
  findRecentlyAddedSegs,
  extractInputValues,
  processInputChange,
  getPeriodDurationInMsec,
  getTimePeriodInputsStartingValue
} from './utilities';
import Button from '../../../../Button';
import Notification from '../../../../Notification';
import ModalSkeleton from '../../../../ModalSkeleton';
import ModalTimezoneNotification from '../ModalTimezoneInfo';
import TimePeriodInput from './PeriodInput';
import Segments from './Segments';

const formId = 'recently-added-segs-modal'; // there is no form, but id is used to construct unique ids for inputs

const getStartingState = () => {
  const inputVals = getTimePeriodInputsStartingValue();
  return {
    ...inputVals,
    showMessage: true,
    recentlyAddedSegments: null,
    periodDurationInMsec: getPeriodDurationInMsec(inputVals),
    showSessionTzMessage: false
  };
};

class RecentlyAddedModal extends Component {
  constructor(props) {
    super(props);
    this.inputChangeHandlerFactory = this.inputChangeHandlerFactory.bind(this);
    this.reset = this.reset.bind(this);
    this.refreshTimeData = this.refreshTimeData.bind(this);
    const _state = getStartingState();
    this.state = {
      ..._state,
      recentlyAddedSegments: findRecentlyAddedSegs(this.props.job.time.weeks, _state.periodDurationInMsec)
    };
  };

  inputChangeHandlerFactory(propName) {
    return ({ target }) => {
      let stateUpdates = processInputChange(propName, target.value);
      const periodDurationInMsec = getPeriodDurationInMsec({ ...this.state, ...stateUpdates });
      stateUpdates.recentlyAddedSegments = findRecentlyAddedSegs(this.props.job.time.weeks, periodDurationInMsec);
      this.setState({ ...stateUpdates, periodDurationInMsec });
    };
  };

  reset() {
    this.setState(getStartingState(), this.refreshTimeData);
  };

  refreshTimeData() {
    const job = currentJobService.getValue();
    this.setState({
      recentlyAddedSegments: findRecentlyAddedSegs(
        job.time.weeks, this.state.periodDurationInMsec
      )
    });
  };

  componentDidMount() {
    currentJobService.subscribe(this.refreshTimeData);
  };

  componentWillUnmount() {
    currentJobService.unsub(this.refreshTimeData);
  };

  render() {
    const { reset, inputChangeHandlerFactory } = this;
    const {
      isActive,
      closeModal,
      disabled,
      toggleDeleteSegmentModal,
      toggleEditSegmentModal,
      toggleSessionTimezoneModal
    } = this.props;
    const { showMessage, recentlyAddedSegments, showSessionTzMessage } = this.state;
    const inputValues = extractInputValues(this.state);

    const closeMessage = () => this.setState({ showMessage: false });
    const toggleSessionTzMessage = (
      isActiveAfterToggle => this.setState({ showSessionTzMessage: !!isActiveAfterToggle })
    );

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
        <ModalTimezoneNotification
          {...{
            toggleSessionTimezoneModal
          }}
          showMessage={showSessionTzMessage}
          toggleMessage={toggleSessionTzMessage}
        />
        {showMessage && (
          <Notification
            theme="info"
            messages={[
              'The most recently added time segments are listed below beginning with the most recently added.',
              'Use the controls below to adjust how far back in time to look.'
            ]}
            close={closeMessage}
          />
        )}
        <TimePeriodInput
          changeHandlerFactory={inputChangeHandlerFactory}
          {...inputValues}
          isActive={!disabled}
          {...{ formId }}
        />
        <hr style={style.divider} />
        <Segments
          segments={recentlyAddedSegments}
          {...{
            toggleDeleteSegmentModal,
            toggleEditSegmentModal,
            disabled
          }}
        />
      </ModalSkeleton>
    );
  };
}

export default RecentlyAddedModal;
