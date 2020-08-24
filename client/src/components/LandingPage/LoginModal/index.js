import React, { Component } from 'react';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import { TextInput, ProgressBar, FormMessages } from '../../formPieces';
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
function getStartingState() {
  return {
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
}
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
    this.state = getStartingState();
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
            this.setState(getStartingState());
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
    this.setState(getStartingState());
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
        isCloseButtonDisabled={isLoading || hasSuccess}
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
              theme={hasSuccess ? "success" : "primary"}
              onClick={this.submit}
              disabled={
                isLoading || hasSuccess || !usernameOrEmail || !password
              }
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
          <FormMessages
            {...{
              showMessage,
              hasSuccess,
              problemMessages,
            }}
            hasProblem={!!problems}
            successMessages={[<><strong>Success!</strong> You are signed in.</>]}
            successRedirect={{
              secondsToDelayRedirect,
              secondsRemaining: secondsUntilRedirect,
              messageFragment: 'You will be redirected'
            }}
            closeMessage={() => this.setState({ showMessage: false })}
          />
          {fieldsInfo.map((field, index) => (
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
          ))}
        </form>
      </ModalSkeleton>
    );
  };
}

export default LoginModal;