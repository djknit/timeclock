import React, { Component } from 'react';
import getStyle from './style';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import { TextInput } from '../../formFields';
import Notification, { NotificationText } from '../../Notification';
import { api } from '../../../utilities';
import { userService } from '../../../data';

const fieldsInfo = [
  {
    name: 'username',
    label: 'Create a Username...',
    type: 'text',
    placeholder: 'Your username...',
    iconClass: 'fas fa-user-tag',
    helpText: '4 characters minimum. Case-sensitive.'
  },
  {
    name: 'email',
    label: 'And/or Enter Your Email',
    type: 'email',
    placeholder: 'example@email.com',
    iconClass: 'fas fa-envelope',
    helpText: 'Not case-sensitive.'
  },
  {
    name: 'password',
    label: 'Create a Password',
    type: 'newPassword',
    placeholder: 'Your password...',
    iconClass: 'fas fa-lock',
    helpText: '7 characters minimum.'
  },
  {
    name: 'verifyPassword',
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
function getTakenUsernameDisplayMessage(username) {
  return `The username "${username}" is not available.`;
}
function getTakenEmailDisplayMessage(email) {
  return `There is already an account for the email address "${email}".`;
}


class NewUserModal extends Component {
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
      username, email, password, verifyPassword, unavailableEmails, unavailableUsernames
    } = this.state;
    console.log(unavailableUsernames)
    let problems = {};
    let problemMessages = [];
    const emailRegEx = /.+@.+\..+/;
    if (!email && !username) {
      problems.username = true;
      problems.email = true;
      problemMessages.push('You must enter a username or email address to create an account.');
    }
    if (emailRegEx.test(username)) {
      problems.username = true;
      problemMessages.push('You can\'t use an email address as a username.');
    }
    if (username && username.length < 4) {
      problems.username = true;
      problemMessages.push('Invalid username: must be at least 4 characters long.');
    }
    if (email && !emailRegEx.test(email)) {
      problems.email = true;
      problemMessages.push('The email you entered is not a valid email address.');
    }
    if (password.length < 7) {
      problems.password = true;
      problems.verifyPassword = true;
      problemMessages.push('Invalid password: must be at least 7 characters long.')
    }
    if (password !== verifyPassword) {
      problems.verifyPassword = true;
      problemMessages.push('The passwords you entered don\'t match.');
    }
    if (username && unavailableUsernames.indexOf(username) !== -1) {
      problems.username = true;
      problemMessages.push(getTakenUsernameDisplayMessage(username));
    }
    if (email && unavailableEmails.indexOf(email.toLowerCase()) !== -1) {
      problems.username = true;
      problemMessages.push(getTakenEmailDisplayMessage(email));
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
      const problemMessages = messages.map(
        message => {
          if (message === takenUsernameMessage) {
            return getTakenUsernameDisplayMessage(username);
          }
          if (message === takenEmailMessage) {
            return getTakenEmailDisplayMessage(email);
          }
          return message;
        }
      );
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
      hasSuccess, isLoading, hasProblem, problems, showMessage, problemMessages, username, email, password, verifyPassword, secondsUntilRedirect
    } = this.state;

    // const style = getStyle();
    console.log(this.state)

    return (
      <ModalSkeleton
        title="New User Sign Up"
        isActive={isActive}
        closeModal={closeModal}
        footerContent={
          <>
            <Button
              color="primary"
              onClick={this.submit}
              disabled={isLoading || hasSuccess || (!username && !email) || !password || !verifyPassword}
              formId={formId}
              isSubmit={true}
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

export default NewUserModal;