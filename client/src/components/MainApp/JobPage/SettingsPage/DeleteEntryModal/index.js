import React, { Component } from 'react';
import {
  api,
  getSchedEntryFromId,
  bindFormMethods
} from '../utilities';
import { currentJobService } from '../../../../../data';
import Tag, { TagGroup } from '../../../../Tag';
import FormModal from '../../../../FormModal';

class DeleteEntryModal extends Component {
  constructor(props) {
    super(props);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  processAndSubmitData() {
    const { entryToEditId, settingName, jobId } = this.props;
    const updates = {
      remove: [{ id: entryToEditId }]
    };
    return api.jobs.updateSetting(settingName, { jobId, updates });
  };

  processSuccessResponse(response) {
    return this.props.setEntryToEditId(null)
    .then(() => currentJobService.setValue(response.data));
  };

  afterSuccessCountdown() {
    this.props.closeModal();
  };

  componentDidUpdate(prevProps) {
    const { entryToEditId } = this.props;
    if (entryToEditId && (entryToEditId !== prevProps.entryToEditId)) this.reset();
  };

  render() {
    const {
      isActive,
      settingDisplayName,
      valueSchedule,
      entryToEditId
    } = this.props;
    const {
      hasSuccess,
    } = this.state;

    if (!isActive) {
      return <></>;
    }

    const {
      valueSimpleText, dateRangeText, dateRangeShortText, startDateShortText
    } = getSchedEntryFromId(entryToEditId, valueSchedule) || {};
    const lowCaseSettingName = settingDisplayName.toLowerCase();

    return (
      <FormModal
        formMgmtComponent={this}
        infoMessages={[
          <>You are deleting the {lowCaseSettingName} value for {dateRangeText}.</>,
          <>The {lowCaseSettingName} will no longer change on {startDateShortText}.</>,
          <>Press "Submit" to procede.</>
        ]}
        successMessages={[
          `The ${lowCaseSettingName} value schedule entry was successfully removed.`,
        ]}
        successRedirectMessageFragment="This dialog box will close"
        title={`Delete ${settingDisplayName} Schedule Entry`}
      >
        {!hasSuccess && (
          <>
            <TagGroup align="center" isInline>
              <Tag theme="info" size={6}>
                Time Period:
              </Tag>
              <Tag theme="info light" size={6}>
                {dateRangeShortText}
              </Tag>
            </TagGroup>
            <TagGroup align="center" isInline>
              <Tag theme="info" size={6}>
                Current Value:
              </Tag>
              <Tag theme="info light" size={6}>
                {valueSimpleText}
              </Tag>
            </TagGroup>
          </>
        )}
      </FormModal>
    );
  };
}

export default DeleteEntryModal;