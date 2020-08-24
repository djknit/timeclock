import React, { Component } from 'react';
import { api, changeHandlerFactoryFactory, constants } from '../../utilities';
import ModalSkeleton from '../../../ModalSkeleton';
import Button from '../../../Button';
import Notification, { NotificationText } from '../../../Notification';
import { jobsService, currentJobService } from '../../../../data';
import { TextInput, ProgressBar, FormMessages } from '../../../formPieces';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

function getStartingState() {
  return {
    password: '',
    problems: {},
    hasSuccess: false,
    isLoading: false,
    hasProblem: false,
    problemMessages: [],
    showMessage: true,
    hasBeenSubmitted: false
  };
}
const formId = 'delete-job-modal';

class DeleteJobModal extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory().bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.setSubmissionProcessingState = this.setSubmissionProcessingState.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = getStartingState();
  };

  afterChange() {
    if (this.state.hasBeenSubmitted) this.setState(this.getInputProblems());
  };

  getInputProblems() {
    const { password } = this.state;
    let problems = {};
    let problemMessages = [];
    if (!password) {
      problems.password = true;
      problemMessages.push('You must enter your password.');
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
    const { job, returnToDashboard } = this.props;
    const { password } = this.state;
    this.setSubmissionProcessingState()
    .then(() => {
      const { problems, problemMessages } = this.getInputProblems();
      if (problemMessages.length > 0) {
        throw {
          problems,
          messages: problemMessages
        };
      }
      return api.jobs.delete({
        jobId: job._id,
        password
      });
    })
    .then(res => {
      // console.log(res)
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
      jobsService.removeJob(job._id);
      const intervalId = setInterval(
        () => {
          secondsUntilRedirect -= stepSizeOfRedirectDelay;
          this.setState({ secondsUntilRedirect });
          if (secondsUntilRedirect <= 0) {
            clearInterval(intervalId);
            this.reset();
            returnToDashboard();
            currentJobService.clearCurrentJob();
          }
        },
        1000 * stepSizeOfRedirectDelay
      );
    })
    .catch(err => {
      this.props.catchApiUnauthorized(err);
      const errorData = (err && err.response && err.response.data) || err || {};
      const { problems, messages } = errorData;
      this.setState({
        problems: problems || { unknown: true },
        problemMessages: messages || ['An unknown problem has occured.'],
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
    const { props, state, reset, submit, changeHandlerFactory } = this;
    const { isActive, closeModal, job, inputRef } = props;
    const {
      password, problems, hasSuccess, isLoading, hasProblem, problemMessages, showMessage, secondsUntilRedirect
    } = state;

    if (!isActive) {
      return <></>;
    }

    const closeMessage = () => this.setState({ showMessage: false });

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title="Delete Job"
        isCloseButtonDisabled={isLoading}
        footerContent={
          <>
            <Button
              theme="light"
              onClick={() => {
                reset();
                closeModal();
              }}
              disabled={isLoading || hasSuccess}
            >
              Cancel
            </Button>
            <Button
              theme={hasSuccess ? 'success' : 'primary'}
              onClick={submit}
              disabled={
                isLoading || hasSuccess || !password
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
          <FormMessages
            {...{
              showMessage,
              hasSuccess,
              problemMessages,
            }}
            hasProblem={hasProblem}
            infoMessages={[
              `You are about to permanently this job ("${job.name}").`,
              <>You will <strong>not</strong> be able to restore the job once it is deleted.</>
            ]}
            successMessages={[
              <><strong>Success!</strong> The job "{job.name}"" was deleted.</>
            ]}
            successRedirect={{
              secondsToDelayRedirect,
              secondsRemaining: secondsUntilRedirect,
              messageFragment: 'You will be redirected'
            }}
            closeMessage={() => this.setState({ showMessage: false })}
          />
          <TextInput
            propName="password"
            value={password}
            label="Enter Your Password to Continue"
            placeholder="Your password..."
            hasProblem={problems && problems.password}
            iconClass={hasSuccess ? 'fas fa-unlock' : 'fas fa-lock'}
            isActive={!isLoading && !hasSuccess}
            {...{
              changeHandlerFactory,
              formId,
              inputRef
            }}
            type="password"
          />
        </form>
      </ModalSkeleton>
    );
  };
}

export default DeleteJobModal;