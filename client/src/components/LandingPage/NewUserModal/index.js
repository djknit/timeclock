import React, { Component } from 'react';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import TextInput from '../../formFields/TextInput';

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
    this.state = {
      username: '',
      email: '',
      password: '',
      verifyPassword: '',
      problems: {},
      hasSuccess: false,
      isLoading: false,
      hasProblem: false,
      showInstructions: true
    };
  };

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { isActive, closeModal } = this.props;
    const { hasSuccess, isLoading, hasProblem, problems, showInstructions, problemMessage } = this.state;

    return (
      <ModalSkeleton
        title="New User Sign Up"
        isActive={isActive}
        closeModal={closeModal}
        footerContent={
          <>
            <Button>TEST</Button>
          </>
        }
      >
        <form>
          {showInstructions &&
            <p className="help">
              You must create a username OR provide an e-mail address. You may also choose to do both. If you enter a username and an email address, you can use
              either to sign in. Usernames are case-sensitive; email addresses are not. If you provide an email, you will be able to use it to recover your password.
            </p>
          }
          {hasSuccess &&
            <div className="notification is-success has-shadow">
              <strong>Success!</strong> Your account was created.
              <br />You are now signed in.
            </div>
          }
          {hasProblem &&
            <div className="notification is-danger has-shadow">
              {problemMessage}
            </div>
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
              />
            )
          )}
        </form>
      </ModalSkeleton>
    );
  };
}

export default NewUserModal;