import React, { Component } from 'react';
import {
  api,
  constants,
  getSchedEntryFromId,
  bindCommonFormMethods
} from '../utilities';
import { currentJobService } from '../../../../../data';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Tag, { TagGroup } from '../../../../Tag';
import { FormButtons, FormMessages } from '../../../../formPieces';

const { secondsToDelayRedirect } = constants;

class DeleteEntryModal extends Component {
  constructor(props) {
    super(props);
    this.processAndSubmitData = this.processAndSubmitData.bind(this);
    this.processSuccessResponse = this.processSuccessResponse.bind(this);
    this.afterSuccessCountdown = this.afterSuccessCountdown.bind(this);
    bindCommonFormMethods(this);
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
    .then(() => currentJobService.setCurrentJob(response.data));
  };

  afterSuccessCountdown() {
    this.props.closeModal();
  };

  componentDidUpdate(prevProps) {
    const { entryToEditId } = this.props;
    if (entryToEditId && (entryToEditId !== prevProps.entryToEditId)) this.reset();
  };

  render() {
    const { reset, submit } = this;
    const {
      isActive,
      closeModal,
      settingDisplayName,
      valueSchedule,
      entryToEditId
    } = this.props;
    const {
      hasSuccess,
      hasProblem,
      problemMessages,
      showMessage,
      secondsUntilRedirect,
      isLoading
    } = this.state;

    if (!isActive) {
      return <></>;
    }

    const {
      valueSimpleText, dateRangeText, dateRangeShortText, startDateShortText
    } = getSchedEntryFromId(entryToEditId, valueSchedule) || {};
    const lowCaseSettingName = settingDisplayName.toLowerCase();

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title={`Delete ${settingDisplayName} Schedule Entry`}
        isCloseButtonDisabled={isLoading}
        footerContent={
          <FormButtons
            {...{
              hasSuccess,
              isLoading,
              submit
            }}
            cancel={() => {
              reset();
              closeModal();
            }}
          />
        }
      >
        <FormMessages
          {...{
            showMessage,
            hasSuccess,
            problemMessages
          }}
          hasProblem={hasProblem}
          infoMessages={[
            <>You are deleting the {lowCaseSettingName} value for {dateRangeText}.</>,
            <>The {lowCaseSettingName} will no longer change on {startDateShortText}.</>,
            <>Press "Submit" to procede.</>
          ]}
          successMessages={[
            `The ${lowCaseSettingName} value schedule entry was successfully removed.`,
          ]}
          successRedirect={{
            secondsToDelayRedirect,
            secondsRemaining: secondsUntilRedirect,
            messageFragment: 'This dialog box will close',
          }}
          closeMessage={() => this.setState({ showMessage: false })}
        />
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
      </ModalSkeleton>
    );
  };
}

export default DeleteEntryModal;