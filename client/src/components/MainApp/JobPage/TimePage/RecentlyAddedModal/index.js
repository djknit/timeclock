import React, { Component } from 'react';
import getStyle from './style';
import {
  formatMyDate,
  formatSegmentTimes,
  formatDuration,
  findRecentlyAddedSegs,
  changeHandlerFactoryFactory
} from './utilities';
import { SelectInput } from '../../../../formPieces';
import Button from '../../../../Button';
import Notification from '../../../../Notification';
import ModalSkeleton from '../../../../ModalSkeleton';

const formId = 'recently-added-period-form';

const getOption = (name, value) => ({ name, value });
const timePeriodOptions = [
  getOption('hour', 'hour'),
  getOption('4 hours', 'fourHour'),
  getOption('24 hours', 'day'),
  getOption('7 days', 'week'),
  getOption('14 days', 'twoWeek')
  // getOption('Other...', 'custom')
];

const getStartingState = () => ({
  timePeriodChoice: 'day',
  customPeriodNumber: '',
  customPeriodUnit: 'hour',
  showMessage: false
});

class RecentlyAddedModal extends Component {
  constructor(props) {
    super(props);
    this.changeHandlerFactory = changeHandlerFactoryFactory().bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      ...getStartingState()
    };
  };

  reset() {
    this.setState(getStartingState());
  };

  render() {
    const { reset, changeHandlerFactory } = this;
    const { isActive, closeModal, disabled } = this.props;
    const {
      timePeriodChoice, customPeriodNumber, customPeriodUnit, showMessage
    } = this.state;

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
        <SelectInput
          propName="timePeriodChoice"
          value={timePeriodChoice}
          options={timePeriodOptions}
          {...{
            changeHandlerFactory,
            formId
          }}
          label="Show Time Entered In The Past..."
          isActive={!disabled}
          labelStyle={style.periodSelectLabel}
        />
      </ModalSkeleton>
    );
  };
}

export default RecentlyAddedModal;

