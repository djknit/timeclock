import React, { Component } from 'react';
import FormModal from '../../../../FormModal';
import { bindFormMethods, api } from '../utilities';

class EditSegmentModal extends Component {
  constructor(props) {
    super(props);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    return {
      startDate: null,
      endDate: null,
      // startTime: getTimeInputStartingValue(),
      // endTime: getTimeInputStartingValue(),
      messagesAreaMinHeight: undefined
    };
  };

  processAndSubmitData() {
    
  };

  processSuccessResponse(response) {

  };

  afterSuccessCountdown() {
    this.props.closeModal();
  };

  componentDidUpdate(prevProps) {
    const _getSegId = _props => _props.segmentToEdit && _props.segmentToEdit._id.toString();
    if (_getSegId(this.props) !== _getSegId(prevProps)) {
      this.reset();
    }
  };

  render() {
    const { isActive, segmentToEdit } = this.props;
    const { hasSuccess, hasProblem } = this.state;

    if (!isActive) {
      return <></>;
    }

    return (
      <FormModal
        formMgmtComponent={this}
        infoMessages={[]}
        successMessages={[]}
        successRedirectMessageFragment="This dialog box will close"
        title="Edit Time Segment"
      > 

      </FormModal>
    );
  };
}

export default EditSegmentModal;
