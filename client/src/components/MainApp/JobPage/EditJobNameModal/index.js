import React, { Component } from 'react';
import { jobsService, currentJobService } from '../../../../data';
import {
  api,
  constants,
  changeHandlerFactoryFactory
} from '../../utilities';
import ModalSkeleton from '../../../ModalSkeleton';
import Button from '../../../Button';
import Notification, { NotificationText } from '../../../Notification';
import Tag, { TagGroup } from '../../../Tag';
import { TextInput, ProgressBar } from '../../../formPieces';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;
const formId = 'edit-job-name-form';
const startingState = {
  updatedJobName: '',
  problems: {},
  hasSuccess: false,
  isLoading: false,
  hasProblem: false,
  problemMessages: [],
  showMessage: true,
  hasBeenSubmitted: false,
  secondsUntilRedirect: undefined
};

class EditJobNameModal extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory(this.afterChange).bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.setSubmissionProcessingState = this.setSubmissionProcessingState.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = { ...startingState };
  };

  afterChange() {
    if (this.state.hasBeenSubmitted) {
      this.setState(this.getInputProblems());
    };
  };

  getInputProblems() {
    const { updatedJobName } = this.state;
    let problems = {};
    let problemMessages = [];
    if (!updatedJobName) {
      problems.updatedJobName = true;
      problemMessages.push('You must enter a new job name.');
    }
    else if (jobsService.getValue().map(job => job.name).includes(updatedJobName)) {
      problems.updatedJobName = true;
      problemMessages.push(`You already have a job with the name "${updatedJobName}". Each job must have a unique name.`);
    }
    return { problems, problemMessages };
  };

  setSubmissionProcessingState() {
    return new Promise(resolve => {
      this.setState(
        {
          hasBeenSubmitted: true,
          isLoading: true,
          hasProblem: false,
          showMessage: false,
          problems: {},
          problemMessages: []
        },
        resolve
      );
    });
  };

  submit(event) {
    event.preventDefault();
    const { closeModal, job } = this.props;
    const { updatedJobName } = this.state;
    this.setSubmissionProcessingState()
    .then(() => {
      const { problems, problemMessages } = this.getInputProblems();
      if (problemMessages.length > 0) {
        throw {
          problems,
          messages: problemMessages
        };
      }
      return api.jobs.rename({
        jobId: job._id,
        name: updatedJobName
      });
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
      currentJobService.updateCurrentJob(res.data);
      const intervalId = setInterval(
        () => {
          secondsUntilRedirect -= stepSizeOfRedirectDelay;
          this.setState({ secondsUntilRedirect });
          if (secondsUntilRedirect <= 0) {
            clearInterval(intervalId);
            this.reset();
            closeModal();
          }
        },
        1000 * stepSizeOfRedirectDelay
      );
    })
    .catch(err => {
      this.props.catchApiUnauthorized(err);
      const errorData = (err && err.response && err.response.data) || err || {};
      this.setState({
        problems: {
          updatedJobName: (errorData.problems && errorData.problems.name) ? true : undefined
        },
        problemMessages: errorData.messages || ['An unknown problem has occured.'],
        hasProblem: true,
        isLoading: false,
        showMessage: true
      });
    });
  };

  reset() {
    this.setState(startingState);
  };

  componentDidUpdate(prevProps) { // Not needed unless job ever changes without leaving job page.
    const currentJobId = this.props.job && this.props.job._id.toString();
    const previousJobId = prevProps.job && prevProps.job._id.toString();
    if (currentJobId !== previousJobId) this.reset();
  };

  render() {

    const { props, state, changeHandlerFactory, reset, submit } = this;

    const {
      job, isActive, closeModal, inputRef
    } = props;

    const {
      updatedJobName,
      problems,
      hasSuccess,
      isLoading,
      hasProblem,
      problemMessages,
      showMessage,
      secondsUntilRedirect
    } = state;

    const closeMessage = () => this.setState({ showMessage: false });

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title="Edit Job Name"
        isCloseButtonDisabled={isLoading}
        footerContent={
          <>
            <Button
              theme="light"
              onClick={() => {
                reset();
                closeModal();
              }}
              disabled={isLoading}
            >
              {hasSuccess ? 'Close' : 'Cancel'}
            </Button>
            <Button
              theme={hasSuccess ? 'success' : 'primary'}
              onClick={submit}
              disabled={
                isLoading || hasSuccess || !updatedJobName
              }
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
              <NotificationText isLast>
                Complete the form below to rename this job.
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
                <strong>Success!</strong> The name for this job was updated.
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
              Current Name:
            </Tag>
            <Tag theme="info light" size={6}>
              {job.name}
            </Tag>
          </TagGroup>
          <TextInput
            propName="updatedJobName"
            value={updatedJobName}
            hasProblem={problems && problems.updatedJobName}
            isActive={!isLoading && !hasSuccess}
            type="text"
            label="New Name:"
            placeholder="New job name..."
            isInline
            {...{
              changeHandlerFactory,
              formId,
              inputRef
            }}
          />
        </form>
      </ModalSkeleton>
    );
  };
}

export default EditJobNameModal;