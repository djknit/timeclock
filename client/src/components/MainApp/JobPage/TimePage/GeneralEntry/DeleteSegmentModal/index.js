import React, { Component } from 'react';
import {
  api,
  bindFormMethods
} from '../../../utilities';
import { currentJobTimeService } from '../../../../../../data';

// import { FormButtons, FormMessages } from '../../../../../formPieces';
import FormModal from '../../../../../FormModal';

class DeleteSegmentModal extends Component {
  constructor(props) {
    super(props);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  processAndSubmitData() {
    const { segmentToDelete, weekId, dayId } = this.props;
    const segmentId = segmentToDelete._id;
    api.time.deleteSegment({ segmentId, weekId, dayId });
  };

  processSuccessResponse(response) {
    return this.props.setSegmentToDelete(null)
    .then(() => currentJobTimeService.updateWeek(response.data.week));
  };

  afterSuccessCountdown() {
    this.props.closeModal();
  };

  componentDidUpdate(prevProps) {
    const { segmentToDelete } = this.props;
    if (
      segmentToDelete &&
      segmentToDelete._id.toString() !== prevProps.segmentToDelete._id.toString()
    ) {
      this.reset();
    }
  };

  render() {
    const { isActive, segmentToDelete } = this.props;
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
        title="Delete Time Segment"
      >
        {!hasSuccess && (
          <></>
        )}
      </FormModal>
    );
  };
}

export default DeleteSegmentModal;
