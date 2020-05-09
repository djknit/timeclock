import React, { Component } from 'react';
import getStyle from './style';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import TextInput from '../../formFields/TextInput';
import Notification, { NotificationText } from '../../Notification';

const fieldsInfo = [
  {
    name: 'username',
    label: 'Create a username...',
    type: 'text',
    placeholder: 'Your username...',
    iconClass: 'fas fa-user-tag',
    helpText: '4 characters minimum. Case-sensitive.'
  },
  {
    name: 'email',
    label: 'And/or enter your email',
    type: 'email',
    placeholder: 'example@email.com',
    iconClass: 'fas fa-envelope',
    helpText: 'Not case-sensitive.'
  },
  {
    name: 'password',
    label: 'Create a password',
    type: 'password',
    placeholder: 'Your password...',
    iconClass: 'fas fa-lock',
    helpText: '7 characters minimum.'
  },
  {
    name: 'verifyPassword',
    label: 'Confirm your password',
    type: 'newPassword',
    placeholder: 'Retype password...',
    iconClass: 'fas fa-unlock',
    helpText: ''
  },
];

const formId = '';

class NewUserModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.setShowMessage = this.setShowMessage.bind(this);
    this.isInputValid = this.isInputValid.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      username: '',
      email: '',
      password: '',
      verifyPassword: '',
      problems: {},
      hasSuccess: false,
      isLoading: false,
      hasProblem: false,
      showMessage: true
    };
  };

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  setShowMessage(newValue) {
    this.setState({ showMessage: newValue });
  };

  isInputValid() {
    const { username, email, password, verifyPassword } = this.state;
    const emailRegEx = /.+@.+\..+/;
    if (
      emailRegEx.test(username) ||
      !emailRegEx.test(email) ||
      password.length < 7 ||
      password !== verifyPassword
    ) return false;
  };

  submit() {

  };

  reset() {

  };

  render() {
    const { isActive, closeModal } = this.props;
    const { hasSuccess, isLoading, hasProblem, problems, showMessage, problemMessage } = this.state;

    // const style = getStyle();

    return (
      <ModalSkeleton
        title="New User Sign Up"
        isActive={isActive}
        closeModal={closeModal}
        footerContent={
          <>
            <Button color="primary" onClick={this.submit}>Submit</Button>
          </>
        }
      >
        <form>
          {showMessage && (
            hasProblem ? (
              <Notification theme="danger" close={() => this.setState({ showMessage: false })}>
                {problemMessage}
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
          {hasSuccess &&
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
                hasProblem={problems[this.state[field.name]]}
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