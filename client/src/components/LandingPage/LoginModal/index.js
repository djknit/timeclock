import React, { Component } from 'react';
import getStyle from './style';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import { TextInput } from '../../formFields';
import Notification, { NotificationText } from '../../Notification';
import { api, constants } from '../utilities';
import { userService } from '../../../data';

const fieldsInfo = [
  {
    name: 'usernameOrEmail',
    label: 'Enter Your Username or Email',
    type: 'username',
    placeholder: 'Your username or email...'
  },
  {
    name: 'password',
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
const { secondsToDelayRedirect } = constants;

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.setSubmissionProcessingState = this.setSubmissionProcessingState.bind(this);
    this.state = { ...startingState };
  };

  handleChange(event) {
    const { name, value } = event.target;
    this.setState(
      { [name]: value },
      () => {
        const { problems, hasBeenSubmitted, problemMessages } = this.state;
        if (!hasBeenSubmitted) return;
        let problemsToKeep, problemMessagesToKeep;
        if (name === 'password' && problems.usernameOrEmail) {
          problemsToKeep = { usernameOrEmail: true };
          problemMessagesToKeep = problemMessages.filter(
            message => message.toLowerCase().indexOf('password') === -1
          );
        }
        this.setState(this.getInputProblems(problemsToKeep, problemMessagesToKeep));
      }
    );
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
  }

  submit(event) {
    event.preventDefault();
    const { usernameOrEmail, password } = this.state;
    let { unavailableEmails, unavailableUsernames } = this.state;
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
      const intervalId = setInterval(() => {
        secondsUntilRedirect--;
        this.setState({ secondsUntilRedirect });
        if (secondsUntilRedirect === 0) {
          clearInterval(intervalId);
          this.setState(startingState);
          this.props.history.push('/app');
        }
      }, 1000);
    })
    .catch(err => {
      const errorData = (err && err.response && err.response.data) || {};
      const { problems, messages } = errorData;
      this.setState({
        unavailableEmails,
        unavailableUsernames,
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
      hasSuccess, isLoading, problems, showMessage, problemMessages, usernameOrEmail, password, secondsUntilRedirect
    } = this.state;

    const style = getStyle();

    return (
      <ModalSkeleton
        title="Sign In"
        isActive={isActive}
        closeModal={closeModal}
        isCloseButtonDisabled={hasSuccess}
        footerContent={
          <>
            <Button
              color="light"
              onClick={() => {
                this.reset();
                closeModal();
              }}
              disabled={isLoading || hasSuccess}
            >
              Cancel
            </Button>
            <Button
              color={hasSuccess ? 'success' : 'primary'}
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
                message => (
                  <NotificationText key={message}>
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
                You will be redirected in {secondsUntilRedirect} seconds...
              </NotificationText>
              <progress
                className="progress is-success"
                style={style.progressBar}
                value={secondsToDelayRedirect - secondsUntilRedirect}
                max={secondsToDelayRedirect}
              ></progress>
            </Notification>
          )}
          {fieldsInfo.map(
            (field, index) => (
              <TextInput
                {...field}
                formId={formId}
                value={this.state[field.name]}
                handleChange={this.handleChange}
                isActive={isActive && !isLoading && !hasSuccess}
                hasProblem={problems[field.name]}
                key={index}
                inputRef={index === 0 ? inputRef : undefined}
                iconClass={getIconClass(field.name, hasSuccess)}
              />
            )
          )}
        </form>
      </ModalSkeleton>
    );
  };
}

export default LoginModal;