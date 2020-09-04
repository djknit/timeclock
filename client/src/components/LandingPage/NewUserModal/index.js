import React, { Component } from 'react';
import getStyle from './style';
import {
  api,
  getUsernameProblems,
  getEmailProblems,
  getPasswordProblems,
  bindFormMethods,
  checkApiResProbMsgsForTakenUsernameOrEmail
} from '../utilities';
import { userService } from '../../../data';
import { TextInput } from '../../formPieces';
import FormModal from '../../FormModal';

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

class NewUserModal extends Component {
  constructor(props) {
    super(props);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    return {
      username: '',
      email: '',
      password: '',
      verifyPassword: '',
      unavailableUsernames: [],
      unavailableEmails: []
    };
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

  processAndSubmitData() {
    const { username, email, password } = this.state;
    return api.auth.createAccount({ username, email, password });
  };

  processSuccessResponse(response) {
    userService.setUser(response.data.user);
  };

  processErrorResponse(response) {
    const { email, username } = this.state;
    let { unavailableEmails, unavailableUsernames } = this.state;
    checkApiResProbMsgsForTakenUsernameOrEmail(
      response.data.messages,
      { email, username },
      {
        usernames: unavailableUsernames,
        emails: unavailableEmails
      }
    );
    return new Promise(resolve => {
      this.setState({ unavailableEmails, unavailableUsernames }, resolve);
    });
  };

  afterSuccessCountdown() {
    this.props.history.push('/app');
  };
  
  render() {
    const { isActive, inputRef } = this.props;
    const {
      hasSuccess,
      isLoading,
      problems,
      username,
      email,
      password,
      verifyPassword
    } = this.state;

    const style = getStyle();

    return (
      <FormModal
        formMgmtComponent={this}
        isFormIncomplete={(!username && !email) || !password || !verifyPassword}
        {...{
          formId
        }}
        infoMessages={[
          <>You must create a username <strong>and/or</strong> provide an e-mail address.</>,
          <>
            If you provide an email, you will be able to use it to recover your account if you forget your password.
          </>
        ]}
        successMessages={[
          <><strong>Success!</strong> Your account was created.</>,
          <>You are now signed in.</>
        ]}
        successRedirectMessageFragment="You will be redirected"
        title="New User Sign Up"
        disableCloseOnSuccess
      >
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
      </FormModal>
    );
  };
}

export default NewUserModal;