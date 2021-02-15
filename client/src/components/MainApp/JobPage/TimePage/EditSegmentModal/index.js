import React, { Component } from 'react';
import getStyle from './style';
import { currentJobTimeService } from '../../../../../data';
import {
  bindFormMethods,
  api,
  convertSegmentToInputValues,
  isTimeSegmentInputIncomplete,
  processEditSegmentInput,
  bindTimeSegFormMethodsAndRefs,
  formatMyDate,
  formatSegmentTimes,
  formatDuration
} from './utilities';
import FormModal from '../../../../FormModal';
import Tag, { TagGroup } from '../../../../Tag';
import TimeSegmentInputs from '../TimeSegmentInputs';

const formId = 'edit-time-segment-form';

class EditSegmentModal extends Component {
  constructor(props) {
    super(props);
    bindTimeSegFormMethodsAndRefs(this, true);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    return {
      ...convertSegmentToInputValues(this.props.segmentToEdit),
      messagesAreaMinHeight: undefined,
      updatedSegments: undefined
    };
  };

  processAndSubmitData() {
    const processedInput = processEditSegmentInput(this.state, this.props);
    return api.time.editSegment(processedInput);
  };

  processSuccessResponse(response) {
    console.log(response && response.data)
    let { weeks, updatedSegment, updatedSegments } = response.data;
    if (!updatedSegments) updatedSegments = [updatedSegment];
    this.setState({ updatedSegments });
    const { reportUpdate, setSegmentToEdit } = this.props;
    if (reportUpdate) reportUpdate(updatedSegments);
    return setSegmentToEdit(null)
    .then(() => currentJobTimeService.setValue(weeks));
  };

  afterSuccessCountdown() {
    this.reset();
    this.props.closeModal();
  };

  componentDidUpdate(prevProps) {
    const _getSegId = _props => _props.segmentToEdit && _props.segmentToEdit._id.toString();
    if (_getSegId(this.props) !== _getSegId(prevProps) && !this.state.hasSuccess) {
      this.reset();
    }
  };

  render() {
    const { isActive, segmentToEdit } = this.props;
    const { messagesAreaMinHeight } = this.state;

    const isFormIncomplete = isTimeSegmentInputIncomplete(this.state);

    const reverseWarning = () => this.setState({ hasWarning: false });

    if (!isActive ) {
      return <></>;
    }

    console.log('segmentToEdit\n', segmentToEdit)

    const style = getStyle(messagesAreaMinHeight);

    return (
      <FormModal
        formMgmtComponent={this}
        infoMessages={['Edit the form below to update this time segment.']}
        successMessages={[
          <><strong>Success!</strong> The time segment was updated.</>
        ]}
        successRedirectMessageFragment="This dialog box will close"
        title="Edit Time Segment"
        messagesAreaStyle={style.messagesArea}
        warningSubmitText="Yes, Add Segments"
        {...{
          isFormIncomplete,
          formId,
          reverseWarning
        }}
        messagesAreaContent={segmentToEdit && (
          <>
            <CurrentValueTags
              content={['Work Date:', formatMyDate(segmentToEdit.date)]}
            />
            <CurrentValueTags
              content={[
                'Current Value:', formatSegmentTimes(segmentToEdit), formatDuration(segmentToEdit.duration)
              ]}
            />
          </>
        )}
      >
        <TimeSegmentInputs
          formMgmtComp={this}
          {...{ formId }}
        />
      </FormModal>
    );
  };
}

export default EditSegmentModal;

function CurrentValueTags({ content }) {
  return (
    <TagGroup size="medium" align="center">
      {content.map((tagContent, index) => (
        <Tag
          theme={index !== 2 && (index % 2 === 1 ? 'info light' : 'info')}
          key={index}
          children={tagContent}
        />
      ))}
    </TagGroup>
  );
}
