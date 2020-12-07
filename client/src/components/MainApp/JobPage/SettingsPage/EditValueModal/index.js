import React, { Component } from 'react';
import {
  api,
  constants,
  convertSettingValueToFormData,
  addWageInputRefs,
  extractWageInputRefs,
  getJobSettingInputProblems,
  processJobSettingInputValue,
  getSchedEntryFromId,
  bindFormMethods
} from '../utilities';
import { currentJobService } from '../../../../../data';
import Tag, { TagGroup } from '../../../../Tag';
import SettingValueInput from '../SettingValueInput';
import FormModal from '../../../../FormModal';
import { addCollapsing } from '../../../../higherOrder';

const { secondsToDelayRedirect } = constants;

const formId = 'edit-job-setting-value-form';

class _EditValueModal_needsCollapsing extends Component {
  constructor(props) {
    super(props);
    addWageInputRefs(this);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    const { entryToEditId, settingName, valueSchedule } = this.props;
    const { value } = getSchedEntryFromId(entryToEditId, valueSchedule) || {};
    return { updatedValue: convertSettingValueToFormData(value, settingName) };
  };

  getInputProblems() {
    const { settingName } = this.props;
    const { updatedValue } = this.state;
    let problems = {};
    let problemMessages = [];
    problems.updatedValue = getJobSettingInputProblems(settingName, updatedValue, problemMessages);
    const hasProblem = problemMessages.length > 0;
    return { problems, problemMessages, hasProblem };
  };

  processAndSubmitData() {
    const { entryToEditId, settingName, jobId } = this.props;
    const { updatedValue } = this.state;
    const updates = {
      edit: [{
        id: entryToEditId,
        value: processJobSettingInputValue(settingName, updatedValue)
      }]
    };
    return api.jobs.updateSetting(settingName, { jobId, updates });
  };

  processSuccessResponse(response) {
    return currentJobService.setValue(response.data);
  };

  afterSuccessCountdown() {
    this.props.closeModal();
  };

  componentDidUpdate(prevProps) {
    const {
      entryToEditId, isActive, windowWidth, wageContentToggle, settingName
    } = this.props;
    if (entryToEditId !== prevProps.entryToEditId) this.reset();
    // checking if toggle is active and needs set or cleared
    const shouldToggleBeSet = isActive && settingName === 'wage' && !!this.state.updatedValue;
    if (
      shouldToggleBeSet &&
      (!wageContentToggle.isHeightSet || windowWidth !== prevProps.windowWidth || !prevProps.isActive)
    ) {
      wageContentToggle.setHeight();
    }
    else if (wageContentToggle.isHeightSet && !shouldToggleBeSet) {
      wageContentToggle.clearHeight();
    }
  };

  render() {
    const { changeHandlerFactory } = this;
    const {
      isActive,
      settingDisplayName,
      valueSchedule,
      entryToEditId,
      settingName,
      wageContentToggle,
      inputRef
    } = this.props;
    const {
      hasSuccess,
      problems,
      updatedValue,
      isLoading
    } = this.state;

    if (!isActive) {
      return <></>;
    }

    const {
      valueSimpleText, dateRangeText, capDateRangeShortText
    } = getSchedEntryFromId(entryToEditId, valueSchedule);

    const lowCaseSettingName = settingDisplayName.toLowerCase();

    const wageInputRefs = extractWageInputRefs(this);

    return (
      <FormModal
        formMgmtComponent={this}
        isFormIncomplete={!updatedValue && updatedValue !== 0}
        {...{
          formId,
          secondsToDelayRedirect
        }}
        infoMessages={[
          <>You are editing the {lowCaseSettingName} for {dateRangeText}.</>,
          <>Enter the new value below.</>
        ]}
        successMessages={[
          <>You successfully updated the {lowCaseSettingName} for {dateRangeText}.</>
        ]}
        successRedirectMessageFragment="This dialog box will close"
        title={`Edit ${settingDisplayName} Schedule Entry Value`}
      >
        <TagGroup align="center" isInline>
          <Tag theme="info" size={6}>
            Time Period:
          </Tag>
          <Tag theme="info light" size={6}>
            {capDateRangeShortText}
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
        <SettingValueInput
          propName="updatedValue"
          value={updatedValue}
          {...{
            settingName,
            changeHandlerFactory,
            formId,
            wageInputRefs,
            wageContentToggle,
            inputRef
          }}
          problems={problems && problems.updatedValue}
          isActive={!isLoading && !hasSuccess}
          label={`New ${settingDisplayName} Value:`}
        />
      </FormModal>
    );
  };
}

const EditValueModal = addCollapsing(
  _EditValueModal_needsCollapsing, 'wageContentToggle', true, true
);

export default EditValueModal;