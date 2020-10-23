import React, { Component } from 'react';
import getStyle from './style';
import { profileService } from '../../../data';
import {
  api,
  capitalizeFirstLetter,
  getUsernameProblems,
  getEmailProblems,
  getPasswordProblems,
  checkApiResProbMsgsForTakenUsernameOrEmail,
  bindFormMethods
} from '../utilities';
import FormModal from '../../FormModal';
import Tag, { TagGroup } from '../../Tag';
import { TextInput } from '../../formPieces';
import { addData } from '../../higherOrder';

function getVariableInputAttrs(propToEditName) {
  if (!propToEditName) return {};
  let type, iconClass;
  switch (propToEditName) {
    case 'username':
      type = 'username';
      iconClass = 'fas fa-user-tag';
      break;
    case 'email':
      type = 'email';
      iconClass = 'fas fa-envelope';
      break;
    case 'password':
      type='newPassword';
      iconClass = 'fas fa-lock';
      break;
    default:
      throw new Error('invalid account prop name');
  }
  let propDisplayName = `${capitalizeFirstLetter(propToEditName)}`;
  if (propToEditName === 'email') propDisplayName += ' Address';
  return {
    type,
    label: `Enter Your New ${propDisplayName}`,
    iconClass,
    placeholder: `Your new ${propToEditName}...`
  };
}
const formId = 'edit-account-form';

class _EditAccountModal_needsData extends Component {
  constructor(props) {
    super(props);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    return {
      updatedAccountProp: '',
      verifyUpdatedPassword: '',
      currentPassword: '',
      unavailableUsernames: [],
      unavailableEmails: []
    };
  };

  afterChange(propName) { // `propName` is the name of the property of the state of this component) that was changed
    const { problems, hasBeenSubmitted, problemMessages } = this.state;
    if (!hasBeenSubmitted) return;
    let problemsToKeep, problemMessagesToKeep;
    if (propName !== 'currentPassword' && problems.currentPassword) {
      problemsToKeep = { currentPassword: true };
      problemMessagesToKeep = problemMessages.filter(
        message => message.toLowerCase().includes('password')
      );
    }
    this.setState(this.getInputProblems(problemsToKeep, problemMessagesToKeep));
  };

  getInputProblems(problemsToKeep, problemMessagesToKeep) {
    const {
      updatedAccountProp, verifyUpdatedPassword, unavailableEmails, unavailableUsernames, currentPassword
    } = this.state;
    const { propToEditName } = this.props;
    let problems = problemsToKeep || {};
    let problemMessages = problemMessagesToKeep || [];
    if (!currentPassword && !problems.currentPassword) {
      problems.currentPassword = true;
      problemMessages.push(
        'You must enter your current password for security in order to complete the update to your account.'
      );
    }
    if (!updatedAccountProp) {
      problems.updatedAccountProp = true;
      problemMessages.push(`You must enter your new ${propToEditName}.`);
      return { problems, problemMessages };
    }
    switch (propToEditName) {
      case 'username':
        if (getUsernameProblems(updatedAccountProp, problemMessages, unavailableUsernames)) {
          problems.updatedAccountProp = true;
        }
        break;
      case 'email':
        if (getEmailProblems(updatedAccountProp, problemMessages, unavailableEmails)) {
          problems.updatedAccountProp = true;
        }
        break;
      case 'password':
        const _passwordProbs = getPasswordProblems(updatedAccountProp, problemMessages, verifyUpdatedPassword);
        if (_passwordProbs && _passwordProbs.password) problems.updatedAccountProp = true;
        if (_passwordProbs && _passwordProbs.verifyPassword) problems.verifyUpdatedPassword = true;
        break;
    }
    return { problems, problemMessages };
  };

  processAndSubmitData() {
    return api.auth.editInfo({
      password: this.state.currentPassword,
      updatedProps: { [this.props.propToEditName]: this.state.updatedAccountProp }
    });
  };

  processSuccessResponse(response) {
    profileService.setValue(response.data.user);
  };

  processErrorResponse(response) {
    const { data } = response;
    const { updatedAccountProp } = this.state;
    let { unavailableEmails, unavailableUsernames } = this.state;
    checkApiResProbMsgsForTakenUsernameOrEmail(
      data.messages,
      {
        username: updatedAccountProp,
        email: updatedAccountProp
      },
      {
        usernames: unavailableUsernames,
        emails: unavailableEmails
      }
    );
    let processedProblems = {};
    if (data.problems.updatedProps) processedProblems.updatedAccountProp = true;
    if (data.problems.password) processedProblems.currentPassword = true;
    data.problems = processedProblems;
    return new Promise(resolve => {
      this.setState({ unavailableEmails, unavailableUsernames }, resolve);
    });
  };

  afterSuccessCountdown() {
    this.props.closeModal();
  };

  componentDidUpdate(prevProps) {
    if (!this.props.isActive && prevProps.isActive) this.reset();
  };

  render() {

    const { props, state, changeHandlerFactory } = this;
    const { user, isActive, propToEditName, inputRef } = props;
    const {
      updatedAccountProp,
      verifyUpdatedPassword,
      currentPassword,
      problems,
      hasSuccess,
      isLoading
    } = state;

    const propToEditCurrentValue = user && user[propToEditName];
    const hasCurrentValue = (propToEditCurrentValue && true) || propToEditName === 'password';
    const capPropToEditName = capitalizeFirstLetter(propToEditName);

    if (!isActive) {
      return <></>;
    }

    const variableUpdateInputAttrs = getVariableInputAttrs(propToEditName);

    const isMissingVerifyPassword = propToEditName === 'password' && !verifyUpdatedPassword;

    const style = getStyle();

    return (
      <FormModal
        formMgmtComponent={this}
        isFormIncomplete={!updatedAccountProp || !currentPassword || isMissingVerifyPassword}
        {...{
          formId
        }}
        infoMessages={[`Complete the form below to update your ${propToEditName}.`]}
        successMessages={[
          <><strong>Success!</strong> Your {propToEditName} was updated.</>
        ]}
        successRedirectMessageFragment="This dialog box will close"
        title={`${hasCurrentValue ? 'Edit' : 'Add'} ${capPropToEditName}`}
      >
        {propToEditName !== 'password' && (
          <TagGroup align="center">
            <Tag theme="info" size={6}>
              {`Current ${capPropToEditName}:`}
            </Tag>
            <Tag theme="info light" size={6}>
              {propToEditCurrentValue ? `"${propToEditCurrentValue}"` : 'none'}
            </Tag>
          </TagGroup>
        )}
        <TextInput
          propName="updatedAccountProp"
          value={updatedAccountProp}
          hasProblem={problems && problems.updatedAccountProp}
          isActive={!isLoading && !hasSuccess}
          {...variableUpdateInputAttrs}
          {...{
            changeHandlerFactory,
            formId,
            inputRef
          }}
        />
        {propToEditName === 'password' && (
          <TextInput
            propName="verifyUpdatedPassword"
            value={verifyUpdatedPassword}
            label="Confirm Your New Password"
            placeholder="Retype your new password..."
            hasProblem={problems && problems.verifyUpdatedPassword}
            iconClass="fas fa-unlock"
            isActive={!isLoading && !hasSuccess}
            {...{
              changeHandlerFactory,
              formId
            }}
            type="newPassword"
          />
        )}
        <hr style={style.hr} />
        <TextInput
          propName="currentPassword"
          value={currentPassword}
          label="Enter Your Current Password"
          placeholder="Your password..."
          hasProblem={problems && problems.currentPassword}
          iconClass={hasSuccess ? 'fas fa-unlock' : 'fas fa-lock'}
          helpText="Enter your current password to verify you identity and complete the update to your account."
          isActive={!isLoading && !hasSuccess}
          {...{
            changeHandlerFactory,
            formId
          }}
          type="password"
        />
      </FormModal>
    );
  };
}

const EditAccountModal = addData(_EditAccountModal_needsData, 'user', profileService);

export default EditAccountModal;