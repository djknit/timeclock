import React, { Component } from 'react';
import getStyle from './style';
import {
  formatMyDate,
  formatSegmentTimes,
  formatDuration
} from './utilities';
import ModalSkeleton from '../../../../ModalSkeleton';

const formId = 'edit-time-segment-form';

class RecentlyAddedModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timePeriodChoice: 'day',
      customPeriodNumber: '',
      customPeriodUnit: 'hour'
    };
  };

  render() {
    const { isActive } = this.props;
    const { timePeriodChoice, customPeriodNumber, customPeriodUnit } = this.state;

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
        title="Recently Added Time"
      >

      </ModalSkeleton>
    );
  };
}

export default RecentlyAddedModal;
