import React, { Component } from 'react';
import {
  api,
  constants,
  getSimpleJobSettingValueText,
  getDateRangeText,
  formatMyDate
} from '../../utilities';
import { currentJobService } from '../../../../../data';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Notification, { NotificationText } from '../../../../Notification';
import Tag, { TagGroup } from '../../../../Tag';
import { ProgressBar } from '../../../../formPieces';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

function getStartingState() {
  return {
    hasSuccess: false,
    hasProblem: false,
    isLoading: false,
    problems: {},
    problemMessages: [],
    showMessage: true,
    secondsUntilRedirect: undefined
  };
}

class DeleteEntryModal extends Component {
  constructor(props) {
    super(props);
    this.setSubmissionProcessingState = this.setSubmissionProcessingState.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = getStartingState();
  };

  setSubmissionProcessingState() {
    return new Promise(
      resolve => {
        this.setState(
          {
            hasProblem: false,
            isLoading: true,
            problems: {},
            problemMessages: [],
            showMessage: false
          },
          resolve
        );
      }
    );
  };

  submit(event) {
    event.preventDefault();
    this.setSubmissionProcessingState()
    .then(() => {
      const { indexOfSchedEntryToEdit, valueSchedule, settingName, jobId } = this.props;
      const updates = {
        remove: [{
          id: valueSchedule[indexOfSchedEntryToEdit]._id.toString()
        }]
      };
      return api.jobs.updateSetting(settingName, { updates, jobId })
    })
    .then(res => {
      let secondsUntilRedirect = secondsToDelayRedirect;
      this.setState({
        hasSuccess: true,
        isLoading: false,
        hasProblem: false,
        showMessage: true,
        problems: {},
        problemMessages: [],
        secondsUntilRedirect
      });
      currentJobService.setCurrentJob(res.data);
      const intervalId = setInterval(
        () => {
          secondsUntilRedirect -= stepSizeOfRedirectDelay;
          this.setState({ secondsUntilRedirect });
          if (secondsUntilRedirect <= 0) {
            clearInterval(intervalId);
            this.props.closeModal();
            this.reset();
          }
        },
        1000 * stepSizeOfRedirectDelay
      )
    })
    .catch(err => {
      this.props.catchApiUnauthorized(err);
      const errorData = (err && err.response && err.response.data) || err || {};
      let { problems, messages } = errorData;
      if (!problems) problems = { unknown: true };
      if (!messages) messages = ['An unknown problem has occurred.'];
      this.setState({
        problems,
        problemMessages: messages,
        hasProblem: true,
        isLoading: false,
        showMessage: true
      });
    });
  };

  reset() {
    this.setState(getStartingState());
  };

  render() {
    const { reset } = this;
    const {
      isActive,
      closeModal,
      settingDisplayName,
      valueSchedule,
      indexOfSchedEntryToEdit,
      settingName
    } = this.props;
    const {
      hasSuccess,
      hasProblem,
      problems,
      problemMessages,
      showMessage,
      secondsUntilRedirect,
      isLoading
    } = this.state;

    if (!isActive) {
      return <></>;
    }

    const entryToEdit = valueSchedule[indexOfSchedEntryToEdit];
    const currentValue = entryToEdit.value;
    const endDate = (
      indexOfSchedEntryToEdit !== valueSchedule.length - 1 ?
      valueSchedule[indexOfSchedEntryToEdit + 1].startDate :
      undefined
    );

    const startDateText = formatMyDate(entryToEdit.startDate, 'MMM. D')
    const dateRangeText = getDateRangeText(entryToEdit.startDate, endDate);
    const dateRangeShortText = getDateRangeText(entryToEdit.startDate, endDate, true);
    const lowCaseSettingName = settingDisplayName.toLowerCase();

    const closeMessage = () => this.setState({ showMessage: false });

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title={`Delete ${settingDisplayName} Schedule Entry`}
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
              onClick={this.submit}
              disabled={isLoading || hasSuccess}
              {...{ isLoading }}
            >
              Submit
            </Button>
          </>
        }
      >
        {showMessage && !hasProblem && !hasSuccess && (
          <Notification theme="info" close={closeMessage}>
            <NotificationText>
              You are deleting the {lowCaseSettingName} value for {dateRangeText}.
            </NotificationText>
            <NotificationText>
              The {lowCaseSettingName} will no longer change on {startDateText}.
            </NotificationText>
            <NotificationText isLast>
              Press "Submit" to precede.
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
              The {lowCaseSettingName} value schedule entry was successfully removed.
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
            {(currentValue || currentValue === 0) ? (
              getSimpleJobSettingValueText(settingName, currentValue)
            ) : (
              'none'
            )}
          </Tag>
        </TagGroup>
      </ModalSkeleton>
    );
  };
}

export default DeleteEntryModal;