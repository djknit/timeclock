import React, { Component } from 'react';
import {
  api,
  constants
} from '../../utilities';
import { currentJobService } from '../../../../../data';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Notification, { NotificationText } from '../../../../Notification';
import Tag, { TagGroup } from '../../../../Tag';
import { ProgressBar, FormMessages } from '../../../../formPieces';

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
    let response, secondsUntilRedirect;
    this.setSubmissionProcessingState()
    .then(() => {
      const { indexOfSchedEntryToEdit, valueSchedule, settingName, jobId } = this.props;
      const updates = {
        remove: [{
          id: valueSchedule[indexOfSchedEntryToEdit]._id.toString()
        }]
      };
      return api.jobs.updateSetting(settingName, { updates, jobId });
    })
    .then(_res => {
      response = _res;
      secondsUntilRedirect = secondsToDelayRedirect;
      this.setState({
        hasSuccess: true,
        isLoading: false,
        hasProblem: false,
        showMessage: true,
        problems: {},
        problemMessages: [],
        secondsUntilRedirect
      });
      return this.props.setEntryToEditById(null);
    })
    .then(() => {
      currentJobService.setCurrentJob(response.data);
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
      );
    })
    .catch(err => {
      this.props.catchApiUnauthorized(err);
      const errorData = (err && err.response && err.response.data) || err || {};
      this.setState({
        problems: errorData.problems || { unknown: true },
        problemMessages: errorData.messages || ['An unknown problem has occurred.'],
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
      indexOfSchedEntryToEdit
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

    const {
      valueSimpleText, dateRangeText, dateRangeShortText, startDateShortText
    } = (indexOfSchedEntryToEdit && valueSchedule[indexOfSchedEntryToEdit]) || {};
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