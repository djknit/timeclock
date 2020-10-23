import React, { Component } from 'react';
import {
  api, 
  getDateChangeUpdateWarnings,
  getSchedEntryFromId,
  bindFormMethods
} from '../utilities';
import { currentJobService } from '../../../../../data';
import getStyle from './style';
import Tag, { TagGroup } from '../../../../Tag';
import { DateInput } from '../../../../formPieces';
import FormModal from '../../../../FormModal';

const formId = 'change-job-setting-date-form';

class ChangeDateModal extends Component {
  constructor(props) {
    super(props);
    this.handleDatepickerPopperToggle = this.handleDatepickerPopperToggle.bind(this);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    return {
      updatedStartDate: null,
      messagesAreaMinHeight: undefined
    };
  };

  handleDatepickerPopperToggle(isActiveAfterToggle) {
    // Make room for popper in above input. Needs 289.3px height. Input label w/ margin is 2rem.
    this.setState({
      messagesAreaMinHeight: isActiveAfterToggle ? `calc(289.3px - 2rem)` : undefined
    });
  };

  getInputProblems() {
    const { updatedStartDate } = this.state;
    let problems = {};
    let problemMessages = [];
    if (!updatedStartDate) {
      problems.updatedStartDate = true;
      problemMessages.push(
        'Missing start date. You must specify the date that this value should go into effect.'
      );
    }
    const hasProblem = problemMessages.length > 0;
    return { problems, problemMessages, hasProblem };
  };

  processAndSubmitData() {
    const { entryToEditId, jobId, settingName } = this.props;
    const { updatedStartDate } = this.state;
    const updates = {
      changeDate: [{
        id: entryToEditId,
        startDate: updatedStartDate
      }]
    };
    return api.jobs.updateSetting(settingName, { jobId, updates });
  };

  getWarnings() {
    const { valueSchedule, entryToEditId, settingDisplayName } = this.props;
    const { hasWarning, updatedStartDate } = this.state;
    const oldStartDate = getSchedEntryFromId(entryToEditId, valueSchedule).startDate;
    return hasWarning ? (
      { hasWarning: false, warningMessages: [] }
    ) : (
      getDateChangeUpdateWarnings(oldStartDate, updatedStartDate, valueSchedule, settingDisplayName)
    );
  };

  processSuccessResponse(response) {
    return currentJobService.setValue(response.data);
  };

  afterSuccessCountdown() {
    this.props.closeModal();
  };

  componentDidUpdate(prevProps) {
    if (this.props.entryToEditId !== prevProps.entryToEditId) {
      this.reset();
    }
  };

  render() {
    const { changeHandlerFactory, handleDatepickerPopperToggle } = this;
    const {
      isActive, settingDisplayName, valueSchedule, entryToEditId, inputRef
    } = this.props;
    const {
      hasSuccess,
      hasWarning,
      problems,
      updatedStartDate,
      isLoading,
      messagesAreaMinHeight
    } = this.state;

    if (!isActive) {
      return <></>;
    }

    const { dateRangeShortText, valueSimpleText, startDate } = getSchedEntryFromId(entryToEditId, valueSchedule) || {};

    const lowCaseSettingName = settingDisplayName.toLowerCase();

    const style = getStyle(messagesAreaMinHeight);

    return (
      <FormModal
        formMgmtComponent={this}
        isFormIncomplete={!updatedStartDate}
        {...{
          formId
        }}
        infoMessages={[
          `To change the date on which this ${lowCaseSettingName} vaue takes effect, enter the new date below.`
        ]}
        successMessages={[
          `You successfully changed the start date for this ${lowCaseSettingName} value.`,
        ]}
        successRedirectMessageFragment="This dialog box will close"
        messagesAreaStyle={style.messagesArea}
        title={`Change ${settingDisplayName} Schedule Entry Start Date`}
        messagesAreaContent={
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
                Value:
              </Tag>
              <Tag theme="info light" size={6}>
                {valueSimpleText}
              </Tag>
            </TagGroup>
          </>
        }
      >
        <DateInput
          propName="updatedStartDate"
          value={updatedStartDate}
          {...{
            changeHandlerFactory,
            formId,
            inputRef,
          }}
          label="Start Date:"
          placeholder="Type or select date..."
          helpText="When does the new value go into effect? Select the first day that the new setting value applies."
          labelStyle={style.label}
          hasProblem={problems && problems.updatedStartDate}
          isActive={!isLoading && !hasSuccess && !hasWarning}
          datePickerProps={{
            popperPlacement: "top-start",
            onCalendarOpen: () => handleDatepickerPopperToggle(true),
            onCalendarClose: () => handleDatepickerPopperToggle(false),
          }}
          openToDate={startDate}
        />
      </FormModal>
    );
  };
}

export default ChangeDateModal;