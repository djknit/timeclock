import React, { Component } from 'react';
import getStyle from './style';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import { TextInput, ProgressBar } from '../../formPieces';
import Notification, { NotificationText } from '../../Notification';
import {
  api,
  constants,
  changeHandlerFactoryFactory,
  getUsernameProblems,
  getEmailProblems,
  getPasswordProblems,
  checkApiResProbMsgsForTakenUsernameOrEmail
} from '../utilities';
import { userService } from '../../../data';

const fieldsInfo = [
  {
    propName: 'username',
    label: 'Create a Username...',
    type: 'username',
    placeholder: 'Your username...',
    iconClass: 'fas fa-user-tag',
    helpText: '4 characters minimum. Case-sensitive.'
  },
  {
    propName: 'email',
    label: 'And/or Enter Your Email',
    type: 'email',
    placeholder: 'example@email.com',
    iconClass: 'fas fa-envelope',
    helpText: 'Not case-sensitive.'
  },
  {
    propName: 'password',
    label: 'Create a Password',
    type: 'newPassword',
    placeholder: 'Your password...',
    iconClass: 'fas fa-lock',
    helpText: '7 characters minimum.'
  },
  {
    propName: 'verifyPassword',
    label: 'Confirm Your Password',
    type: 'newPassword',
    placeholder: 'Retype password...',
    iconClass: 'fas fa-unlock',
    helpText: ''
  },
];
const formId = 'new-user-form';
const startingState = {
  username: '',
  email: '',
  password: '',
  verifyPassword: '',
  problems: {},
  hasSuccess: false,
  isLoading: false,
  hasProblem: false,
  problemMessages: [],
  showMessage: true,
  hasBeenSubmitted: false,
  unavailableUsernames: [],
  unavailableEmails: [],
  secondsUntilRedirect: undefined
};
const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

class NewUserModal extends Component {
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

  afterChange() {
    if (this.state.hasBeenSubmitted) {
      this.setState(this.getInputProblems());
    }
  };

  getInputProblems() {
    const {
      username, email, password, verifyPassword, unavailableEmails, unavailableUsernames
    } = this.state;
    let problems = {};
    let problemMessages = [];
    if (!email && !username) {
      problems.username = true;
      problems.email = true;
      problemMessages.push('You must enter a username or email address to create an account.');
    }
    if (username && getUsernameProblems(username, problemMessages, unavailableUsernames)) {
      problems.username = true;
    }
    if (email && getEmailProblems(email, problemMessages, unavailableEmails)) {
      problems.email = true;
    }
    const _passwordProbs = getPasswordProblems(password, problemMessages, verifyPassword);
    if (_passwordProbs && _passwordProbs.password) problems.password = true;
    if (_passwordProbs && _passwordProbs.verifyPassword) problems.verifyPassword = true;
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
    const { username, email, password } = this.state;
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
      return api.auth.createAccount({ username, email, password });
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
            this.props.history.push('/app');
          }
        },
        1000 * stepSizeOfRedirectDelay
      );
    })
    .catch(err => {
      const errorData = (err && err.response && err.response.data) || err || {};
      let { problems, messages } = errorData;
      if (!problems) problems = { unknown: true };
      if (!messages) messages = ['An unknown problem has occurred.'];
      checkApiResProbMsgsForTakenUsernameOrEmail(
        messages,
        { username, email },
        {
          usernames: unavailableUsernames,
          emails: unavailableEmails
        }
      );
      this.setState({
        unavailableEmails,
        unavailableUsernames,
        problems,
        problemMessages: messages,
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
      hasSuccess, isLoading, hasProblem, problems, showMessage, problemMessages, username, email, password, verifyPassword, secondsUntilRedirect
    } = this.state;

    const style = getStyle();

    return (
      <ModalSkeleton
        title="New User Sign Up"
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
              theme={hasSuccess ? 'success' : 'primary'}
              onClick={this.submit}
              disabled={isLoading || hasSuccess || (!username && !email) || !password || !verifyPassword}
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
          {showMessage && !hasProblem && !hasSuccess && (
            <Notification theme="info" close={() => this.setState({ showMessage: false })}>
              <NotificationText>
                You must create a username <strong>and/or</strong> provide an e-mail address.
              </NotificationText>
              <NotificationText isLast={true}>
                If you provide an email, you will be able to use it to recover your account if you forget your password.
              </NotificationText>
            </Notification>
          )}
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
                <strong>Success!</strong> Your account was created.
              </NotificationText>
              <NotificationText>
                You are now signed in.
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
              />
            )
          )}
        </form>
      </ModalSkeleton>
    );
  };
}

export default NewUserModal;