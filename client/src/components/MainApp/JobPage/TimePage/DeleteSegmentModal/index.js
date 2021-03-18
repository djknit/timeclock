import React, { Component } from 'react';
import {
  api,
  bindFormMethods,
  formatDuration,
  formatSegmentTimes,
  formatMyDate
} from '../utilities';
import { currentJobTimeService } from '../../../../../data';
import Tag, { TagGroup } from '../../../../Tag';
import FormModal from '../../../../FormModal';

class DeleteSegmentModal extends Component {
  constructor(props) {
    super(props);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  processAndSubmitData() {
    const { _id: segmentId, dayId, weekId } = this.props.segmentToDelete;
    return api.time.deleteSegment({ segmentId, weekId, dayId });
  };

  processSuccessResponse(response) {
    return this.props.setSegmentToDelete(null)
    .then(() => {
      currentJobTimeService.updateWeek(response.data.week)
    });
  };

  afterSuccessCountdown() {
    this.reset();
    this.props.closeModal();
  };

  render() {
    const { isActive, segmentToDelete } = this.props;
    const { hasSuccess } = this.state;

    if (!isActive) {
      return <></>;
    }

    return (
      <FormModal
        formMgmtComponent={this}
        infoMessages={[
          <>You are <strong>permanently</strong> deleting the time segment defined below.</>,
          <>Press "Submit" to proceed.</>
        ]}
        successMessages={['The time segment was successfully deleted.']}
        successRedirectMessageFragment="This dialog box will close"
        title="Delete Time Segment"
      >
        {!hasSuccess && segmentToDelete && (
          <>
            <TagGroup align="center" isInline>
              <Tag theme="info" size={6}>
                Schedule Date:
              </Tag>
              <Tag theme="info light" size={6}>
                {formatMyDate(segmentToDelete.date)}
              </Tag>
            </TagGroup>
            <TagGroup align="center" isInline>
              <Tag theme="info" size={6}>
                Start/End:
              </Tag>
              <Tag theme="info light" size={6}>
                {formatSegmentTimes(segmentToDelete)}
              </Tag>
            </TagGroup>
            <TagGroup align="center" isInline>
              <Tag theme="info" size={6}>
                Time Worked:
              </Tag>
              <Tag theme="info light" size={6}>
                {formatDuration(segmentToDelete.duration)}
              </Tag>
            </TagGroup>
          </>
        )}
      </FormModal>
    );
  };
}

export default DeleteSegmentModal;
