import React, { Component } from 'react';
import { api, bindFormMethods } from '../utilities';
import { userService } from '../../../../data';
import FormModal from '../../../FormModal';
import InfoNotification from '../../../RestorableNotification'; //--* TEST *-* * * *
import { TextInput } from '../../../formPieces';

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

class LoginModal extends Component {
  constructor(props) {
    super(props);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    return {
      usernameOrEmail: '',
      password: '',
      showTestMsg: true //--* TEST *-* * * *
    };
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
    const hasProblem = problemMessages.length > 0;
    return { problems, problemMessages, hasProblem };
  };

  processAndSubmitData() {
    const { usernameOrEmail, password } = this.state;
    return api.auth.login({ usernameOrEmail, password });
  };

  processSuccessResponse(response) {
    return userService.setValue(response.data.user);
  };

  afterSuccessCountdown() {
    this.props.history.push('/app/dashboard');
  };

  render() {
    const { isActive, inputRef } = this.props;
    const {
      hasSuccess,
      isLoading,
      problems,
      usernameOrEmail,
      password,
      showTestMsg //--* TEST *-* * * *
    } = this.state;

    return (
      <FormModal
        formMgmtComponent={this}
        isFormIncomplete={!usernameOrEmail || !password}
        {...{
          formId
        }}
        successMessages={[<><strong>Success!</strong> You are signed in.</>]}
        successRedirectMessageFragment="You will be redirected"
        title="Sign In"
        disableCloseOnSuccess
      >
        <InfoNotification
          showMessage={showTestMsg}
          toggleMessage={shouldShowMsg => this.setState({ showTestMsg: shouldShowMsg })}
          theme="info"
          disabled={!isActive || isLoading || hasSuccess}
          messages={['This is a test.', 'Important information can go here.']}
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
      </FormModal>
    );
  };
}

export default LoginModal;