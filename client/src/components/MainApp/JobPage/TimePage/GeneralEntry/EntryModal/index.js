import React, { Component } from 'react';
import {
  api,
  constants,
  bindFormMethods
} from '../../../utilities';
import ModalSkeleton from '../../../../../ModalSkeleton';
import { FormButtons, FormMessages } from '../../../../../formPieces';

class EntryModal extends Component {
  constructor(props) {
    super(props);
    bindFormMethods(this, { hasCountdown: false });
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    return {
      startDate: null,
      endDate: null,
      // startTime: 
    };
  };

  getInputProblems() {

  };

  processAndSubmitData() {

  };

  processSuccessResponse() {

  };

  render() {
    const { isActive } = this.props;

    return (
      <ModalSkeleton
        {...{
          isActive
        }}
      >
  
      </ModalSkeleton>
    );
  };
}

export default EntryModal;
