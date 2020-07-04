import React, { Component } from 'react';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import { TextInput, ProgressBar } from '../../formPieces';
import Notification, { NotificationText } from '../../Notification';
import { api, constants, changeHandlerFactoryFactory } from '../utilities';
import { userService } from '../../../data';

const fieldsInfo = [
  {
    propName: 'usernameOrEmail',
    label: 'Enter Your Username or Email',
    type: 'username',
    placeholder: 'Your username or email...'
  },
  {
    propName: 'password',
    label: 'Enter Your Password',
    type: 'password',
    placeholder: 'Your password...'
  }
];
function getIconClass(fieldName, hasSuccess) {
  if (fieldName === 'usernameOrEmail') {
    return hasSuccess ? 'fas fa-user-tag' : 'fas fa-user';
  }
  return hasSuccess ? 'fas fa-unlock' : 'fas fa-lock';
}
const formId = 'login-form';
const startingState = {
  usernameOrEmail: '',
  password: '',
  problems: {},
  hasSuccess: false,
  isLoading: false,
  hasProblem: false,
  problemMessages: [],
  showMessage: true,
  hasBeenSubmitted: false,
  secondsUntilRedirect: undefined
};
const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory(this.afterChange).bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.setSubmissionProcessingState = this.setSubmissionProcessingState.bind(this);
    this.state = { ...startingState };
  };

  afterChange(propName) {
    const { problems, hasBeenSubmitted, problemMessages } = this.state;
    if (!hasBeenSubmitted) return;
    let problemsToKeep, problemMessagesToKeep;
    if (propName === 'password' && problems.usernameOrEmail) {
      problemsToKeep = { usernameOrEmail: true };
      problemMessagesToKeep = problemMessages.filter(
        message => message.toLowerCase().indexOf('password') === -1
      );
    }
    this.setState(this.getInputProblems(problemsToKeep, problemMessagesToKeep));
  };

  getInputProblems(problemsToKeep, problemMessagesToKeep) {
    const {
      usernameOrEmail, password
    } = this.state;
    let problems = problemsToKeep || {};
    let problemMessages = problemMessagesToKeep || [];
    if (!usernameOrEmail && !problems.usernameOrEmail) {
      problems.usernameOrEmail = true;
      problemMessages.push('You must enter your username or email address.');
    }
    if (!password && !problems.password) {
      problems.password = true;
      problemMessages.push('You must enter a password.');
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
    const { usernameOrEmail, password } = this.state;
    this.setSubmissionProcessingState()
    .then(() => {
      const { problems, problemMessages } = this.getInputProblems();
      if (problemMessages.length > 0) {
        throw {
          problems,
          messages: problemMessages
        };
      }
      return api.auth.login({ usernameOrEmail, password });
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
      userService.setUser(res.data.user);
      const intervalId = setInterval(
        () => {
          secondsUntilRedirect -= stepSizeOfRedirectDelay;
          this.setState({ secondsUntilRedirect });
          if (secondsUntilRedirect <= 0) {
            clearInterval(intervalId);
            this.setState(startingState);
            this.props.history.push('/app/dashboard');
          }
        },
        1000 * stepSizeOfRedirectDelay
      );
    })
    .catch(err => {
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
    this.setState(startingState);
  };

  render() {
    const { isActive, closeModal, inputRef } = this.props;
    const {
      hasSuccess,
      isLoading,
      problems,
      showMessage,
      problemMessages,
      usernameOrEmail,
      password,
      secondsUntilRedirect
    } = this.state;

    return (
      <ModalSkeleton
        title="Sign In"
        isActive={isActive}
        closeModal={closeModal}
        isCloseButtonDisabled={isLoading|| hasSuccess}
        footerContent={
          <>
            <Button
              theme="light"
              onClick={() => {
                this.reset();
                closeModal();
              }}
              disabled={isLoading || hasSuccess}
            >
              Cancel
            </Button>
            <Button
              theme={hasSuccess ? 'success' : 'primary'}
              onClick={this.submit}
              disabled={isLoading || hasSuccess || !usernameOrEmail || !password}
              formId={formId}
              isSubmit={true}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </>
        }
      >
        <form id={formId}>
          {showMessage && problemMessages.length > 0 && (
            <Notification theme="danger" close={() => this.setState({ showMessage: false })}>
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
                <strong>Success!</strong> You are signed in.
              </NotificationText>
              <NotificationText>
                You will be redirected in {Math.floor(secondsUntilRedirect + .5)} seconds...
              </NotificationText>
              <ProgressBar
                theme="success"
                value={secondsToDelayRedirect - secondsUntilRedirect}
                max={secondsToDelayRedirect}
              />
            </Notification>
          )}
          {fieldsInfo.map(
            (field, index) => (
              <TextInput
                {...field}
                formId={formId}
                value={this.state[field.propName]}
                changeHandlerFactory={this.changeHandlerFactory}
                isActive={isActive && !isLoading && !hasSuccess}
                hasProblem={problems[field.propName]}
                key={index}
                inputRef={index === 0 ? inputRef : undefined}
                iconClass={getIconClass(field.propName, hasSuccess)}
              />
            )
          )}
        </form>
      </ModalSkeleton>
    );
  };
}

export default LoginModal;