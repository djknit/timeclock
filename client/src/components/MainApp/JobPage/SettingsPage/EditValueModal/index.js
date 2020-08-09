import React, { Component } from 'react';
import { api, constants, changeHandlerFactoryFactory, getDayCutoffTime } from '../../utilities';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Notification, { NotificationText } from '../../../../Notification';
import Tag, { TagGroup } from '../../../../Tag';
import { SelectInput, WageInput, ProgressBar } from '../../../../formPieces';
import Input from './Input';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

const formId = 'edit-job-setting-value-form';
function getStartingState(settingName, currentValue) {
  return {
    hasSuccess: false,
    hasProblem: false,
    isLoading: false,
    problems: {},
    problemMessages: [],
    showMessage: true,
    hasBeenSubmitted: false, 
    secondsUntilRedirect: undefined,
    updatedValue: convertScheduleValueToStateProp(currentValue, settingName)
  };
}
function convertScheduleValueToStateProp(scheduleValue, settingName) {
  switch (settingName) {
    case 'dayCutoff':
      const valueInMinutes = Math.round(scheduleValue / (1000 * 60));
      return getDayCutoffTime(valueInMinutes, true);
    default:
      return scheduleValue;
  }
}

class EditValueModal extends Component {
  constructor(props) {
    super(props);
    this.changeHandlerFactory = changeHandlerFactoryFactory().bind(this);
    this.submit = this.submit.bind(this);
    this.state = getStartingState();
  };

  getInputProblems() {
    const { settingName } = this.props;
    let problems = {};
    let problemMessages = [];
    switch (settingName) {
      case 'timezone':
        break;
      case 'dayCutof':
        break;
      case 'weekBegins':
        break;
      case 'wage':
        break;
    }
  };

  setSubmissionProcessingState() {

  };

  submit() {

  };

  reset() {
    const { indexOfSchedEntryToEdit, valueSchedule } = this.props;
    this.setState(getStartingState(indexOfSchedEntryToEdit && valueSchedule[indexOfSchedEntryToEdit].value));
  };

  componentDidUpdate(prevProps) {
    const { indexOfSchedEntryToEdit, valueSchedule } = this.props;
    const previousIndex = prevProps.indexOfSchedEntryToEdit;
    const currentEntryId = (indexOfSchedEntryToEdit || indexOfSchedEntryToEdit === 0) && valueSchedule[indexOfSchedEntryToEdit]._id;
    const previousEntryId = (previousIndex || previousIndex === 0) && prevProps.valueSchedule[previousIndex]._id;
    if (currentEntryId !== previousEntryId) this.reset();
  };

  render() {
    const { reset, submit, changeHandlerFactory } = this;
    const {
      isActive, closeModal, settingDisplayName, valueSchedule, indexOfSchedEntryToEdit, settingName
    } = this.props;
    const {
      hasSuccess, hasProblem, problems, problemMessages, showMessage, secondsUntilRedirect, updatedValue, isLoading
    } = this.state;

    if (!isActive) return <></>;

    const entryToEdit = valueSchedule[indexOfSchedEntryToEdit];
    const currentValue = entryToEdit.value;
    const endDate = (
      indexOfSchedEntryToEdit !== valueSchedule.length - 1 ?
      valueSchedule[indexOfSchedEntryToEdit + 1].startDate :
      undefined
    );
    const inputProblems = problems && problems.updatedValue;

    const dateRangeText = getDateRangeText(entryToEdit.startDate, endDate);
    const lowCaseSettingName = settingDisplayName.toLowerCase();

    const closeMessage = () => this.setState({ showMessage: false });

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title={``}
        isCloseButtonDisabled={isLoading}
        footerContent={
          <>
            <Button
              theme="light"
              onClick={() => {
                reset();
                closeModal();
              }}
            >
              {hasSuccess ? 'Close' : 'Cancel'}
            </Button>
            <Button
              theme={hasSuccess ? 'success' : 'primary'}
              onClick={submit}
              disabled={isLoading || hasSuccess || !updatedValue}
              isSubmit
              {...{
                formId,
                isLoading
              }}
            >
              Submit
            </Button>
          </>
        }
      >
        <form id={formId}>
          {showMessage && !hasProblem && !hasSuccess && (
            <Notification theme="info" close={closeMessage}>
              <NotificationText>
                You are editing the {lowCaseSettingName} for {dateRangeText}.
              </NotificationText>
              <NotificationText isLast>
                Enter the new {lowCaseSettingName} below.
              </NotificationText>
            </Notification>
          )}
          {showMessage && problemMessages.length > 0 && (
            <Notification theme="danger" close={closeMessage}>
              {problemMessages.map(
                (message, index, arr) => (
                  <NotificationText key={message} isLast={index === arr.length - 1}>
                    {message}
                  </NotificationText>
                )
              )}
            </Notification>
          )}
          {showMessage && hasSuccess && (
            <Notification theme="success">
              <NotificationText>
                You successfully updated the {lowCaseSettingName} fo {dateRangeText}.
              </NotificationText>
              <NotificationText>
                This dialog box will close in {Math.floor(secondsUntilRedirect + .5)} seconds...
              </NotificationText>
              <ProgressBar
                theme="success"
                value={secondsToDelayRedirect - secondsUntilRedirect}
                max={secondsToDelayRedirect}
              />
            </Notification>
          )}
          <TagGroup align="center">
            <Tag theme="info" size={6}>
              Current Value:
            </Tag>
            <Tag theme="info light" size={6}>
              {currentValue || 'none'}
            </Tag>
          </TagGroup>
          <Input
            propName="updatedValue"
            value={updatedValue}
            {...{
              settingName,
              changeHandlerFactory,
              formId
            }}
            problems={inputProblems}
            hasProblem={inputProblems}
            isActive={!isLoading && !hasSuccess}
            label={`New ${settingDisplayName}:`}
          />
        </form>
      </ModalSkeleton>
    );
  };
}

export default EditValueModal;

function getDateRangeText(startDate, endDate) {
  if (!startDate && !endDate) {
    return 'all time';
  }
  if (!startDate) {
    return `all dates prior to and including `;
  }
  if (!endDate) {
    return `all dates on or after `;
  }
  return ``;
}