import React, { Component } from 'react';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import { TextInput } from '../../formFields';
import Notification, { NotificationText } from '../../Notification';
import { api } from '../../../utilities';
import { userService } from '../../../data';

const fieldsInfo = [
  {
    name: 'usernameOrEmail',
    label: 'Enter Your Username or Email',
    type: 'text',
    placeholder: 'Your username or email...',
    iconClass: 'fas fa-user-tag'
  },
  {
    name: 'password',
    label: 'Enter Your Password',
    type: 'password',
    placeholder: 'Your password...',
    iconClass: 'fas fa-lock'
  }
];
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
        if (this.state.hasBeenSubmitted) {
          this.setState(this.getInputProblems());
        }
      }
    );
  };

  getInputProblems() {
    console.log('validate inputs')
    const {
      usernameOrEmail, password
    } = this.state;
    let problems = {};
    let problemMessages = [];
    if (!usernameOrEmail) {
      problems.usernameOrEmail = true;
      problemMessages.push('You must enter your username or email address.');
    }
    if (password.length < 7) {
      problems.password = true;
      problemMessages.push('Invalid password: must be at least 7 characters long.')
    }
    return { problems, problemMessages };
    // this.setState({ problems, problemMessages });
    // return problemMessages.length === 0;
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
    console.log('submit')
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
      let secondsUntilRedirect = 6;
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
      console.log(err)
      console.log('awefjio')
      console.log(err.response)
      const errorData = err.response && err.response.data || err;
      const { problems, messages } = errorData;
      const takenUsernameMessage = 'That username is taken.';
      const takenEmailMessage = 'There is already an account for that email address.';
      if (messages.indexOf(takenUsernameMessage) !== -1) {
        unavailableUsernames = [...unavailableUsernames];
        unavailableUsernames.push(username);
      }
      if (messages.indexOf(takenEmailMessage) !== -1) {
        unavailableEmails = [...unavailableEmails];
        unavailableEmails.push(email);
      }
      const problemMessages = messages;
      this.setState({
        unavailableEmails,
        unavailableUsernames,
        problems,
        problemMessages,
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
    const { isActive, closeModal } = this.props;
    const {
      hasSuccess, isLoading, hasProblem, problems, showMessage, problemMessages, usernameOrEmail, password, secondsUntilRedirect
    } = this.state;

    return (
      <ModalSkeleton
        title="Sign In"
        isActive={isActive}
        closeModal={closeModal}
        footerContent={
          <>
            <Button
              color="primary"
              onClick={this.submit}
              disabled={isLoading || hasSuccess || !usernameOrEmail || !password}
              formId={formId}
              isSubmit={true}
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
                <strong>Success!</strong> Your account was created.
              </NotificationText>
              <NotificationText>
                You are now signed in.
              </NotificationText>
              <NotificationText isLast={true}>
                You will be redirected in {secondsUntilRedirect} seconds...
              </NotificationText>
            </Notification>
          )}
          {fieldsInfo.map(
            (field, index) => (
              <TextInput
                {...field}
                value={this.state[field.name]}
                handleChange={this.handleChange}
                isActive={isActive && !isLoading && !hasSuccess}
                index={index}
                hasProblem={problems[field.name]}
                key={index}
              />
            )
          )}
        </form>
      </ModalSkeleton>
    );
  };
}

export default LoginModal;