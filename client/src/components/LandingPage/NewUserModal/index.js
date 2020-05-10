import React, { Component } from 'react';
import getStyle from './style';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import TextInput from '../../formFields/TextInput';
import Notification, { NotificationText } from '../../Notification';

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
  showMessage: true
};


class NewUserModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.setShowMessage = this.setShowMessage.bind(this);
    this.validateInputs = this.validateInputs.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      ...startingState
    };
  };

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  setShowMessage(newValue) {
    this.setState({ showMessage: newValue });
  };

  validateInputs() {
    console.log('validate inputs')
    const { username, email, password, verifyPassword } = this.state;
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
    console.log('a-')
    this.setState({ problems, problemMessages });
    console.log('a')
    return problemMessages.length === 0;
  };

  submit(event) {
    console.log('submit')
    event.preventDefault();
    this.setState({
      isLoading: true,
      hasProblem: false,
      showMessage: false,
      problems: {},
      problemMessages: []
    })
    const areInputsValid = this.validateInputs();
    console.log('b')
    console.log(areInputsValid)
    if (!areInputsValid) {
      this.setState({
        isLoading: false,
        hasProblem: true,
        showMessage: true
      });
      return;
    }

  };

  reset() {

  };

  render() {
    const { isActive, closeModal } = this.props;
    const {
      hasSuccess, isLoading, hasProblem, problems, showMessage, problemMessages, username, email, password, verifyPassword
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
              disabled={(!username && !email) || !password || !verifyPassword}
              formId={formId}
              isSubmit={true}
            >
              Submit
            </Button>
          </>
        }
      >
        <form id={formId}>
          {showMessage && (
            hasProblem ? (
              <Notification theme="danger" close={() => this.setState({ showMessage: false })}>
                {problemMessages.map(
                  message => (
                    <NotificationText>
                      {message}
                    </NotificationText>
                  )
                )}
              </Notification>
            ) : (
              <Notification theme="info" close={() => this.setState({ showMessage: false })}>
                <NotificationText>
                  You must create a username <strong>and/or</strong> provide an e-mail address.
                </NotificationText>
                <NotificationText isLast={true}>
                  If you provide an email, you will be able to use it to recover your account if you forget your password.
                </NotificationText>
              </Notification>
            )
          )}
          {showMessage && hasSuccess &&
            <Notification theme="success">
              <NotificationText>
                <strong>Success!</strong> Your account was created.
              </NotificationText>
              <NotificationText isLast={true}>
                You are now signed in.
              </NotificationText>
            </Notification>
          }
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