import React, { Component } from 'react';
import getStyle from './style';
import { profileService } from '../../../data';
import {
  api,
  constants,
  changeHandlerFactoryFactory,
  capitalizeFirstLetter,
  getUsernameProblems,
  getEmailProblems,
  getPasswordProblems,
  checkApiResProbMsgsForTakenUsernameOrEmail
} from '../utilities';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import Notification, { NotificationText } from '../../Notification';
import Tag, { TagGroup } from '../../Tag';
import { TextInput, ProgressBar } from '../../formPieces';
import { addData } from '../../higherOrder';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;
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
const startingState = {
  updatedAccountProp: '',
  verifyUpdatedPassword: '',
  currentPassword: '',
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

class _EditAccountModal_needsData extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory(this.afterChange).bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.setSubmissionProcessingState = this.setSubmissionProcessingState.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = { ...startingState };
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
      updatedAccountProp, verifyUpdatedPassword, unavailableEmails, unavailableUsernames
    } = this.state;
    const { propToEditName } = this.props;
    let problems = problemsToKeep || {};
    let problemMessages = problemMessagesToKeep || [];
    if (!updatedAccountProp) {
      problems.updatedAccountProp = true;
      problemMessages.push(`You must enter your new ${propToEditName}.`);
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
  };

  submit(event) {
    event.preventDefault();
    const { propToEditName, closeModal } = this.props;
    const { updatedAccountProp, currentPassword } = this.state;
    let { unavailableUsernames, unavailableEmails } = this.state;
    this.setSubmissionProcessingState()
    .then(() => {
      const { problems, problemMessages } = this.getInputProblems();
      if (problemMessages.length > 0) {
        throw {
          problems,
          messages: problemMessages
        };
      }
      return api.auth.editInfo({
        password: currentPassword,
        updatedProps: { [propToEditName]: updatedAccountProp }
      });
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
      profileService.setUser(res.data.user);
      const intervalId = setInterval(
        () => {
          secondsUntilRedirect -= stepSizeOfRedirectDelay;
          this.setState({ secondsUntilRedirect });
          if (secondsUntilRedirect <= 0) {
            clearInterval(intervalId);
            this.reset();
            closeModal();
          }
        },
        1000 * stepSizeOfRedirectDelay
      );
    })
    .catch(err => {
      console.log(err)
      this.props.catchApiUnauthorized(err);
      const isApiRes = !!(err && err.response);
      const errorData = (isApiRes && err.response.data) || err || {};
      let problemMessages = errorData.messages || ['An unknown problem has occured.'];
      if (isApiRes) {
        checkApiResProbMsgsForTakenUsernameOrEmail(
          problemMessages,
          {
            username: updatedAccountProp,
            email: updatedAccountProp
          },
          {
            usernames: unavailableUsernames,
            emails: unavailableEmails
          }
        );
        const _probs = errorData.problems || {};
        errorData.problems = {};
        if (_probs.updatedProps) errorData.problems.updatedAccountProp = true;
        if (_probs.password) errorData.problems.currentPassword = true;
      }
      this.setState({
        problems: errorData.problems,
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

  componentDidUpdate(prevProps) {
    if (!this.props.isActive && prevProps.isActive) this.reset();
  };

  render() {

    const { props, state, changeHandlerFactory, reset, submit } = this;

    const {
      user, isActive, propToEditName, closeModal, inputRef
    } = props;
    const propToEditCurrentValue = user && user[propToEditName];
    const hasCurrentValue = (propToEditCurrentValue && true) || propToEditName === 'password';
    const capPropToEditName = capitalizeFirstLetter(propToEditName);

    const {
      updatedAccountProp,
      verifyUpdatedPassword,
      currentPassword,
      problems,
      hasSuccess,
      isLoading,
      hasProblem,
      problemMessages,
      showMessage,
      secondsUntilRedirect
    } = state;

    const variableUpdateInputAttrs = getVariableInputAttrs(propToEditName);

    const isMissingVerifyPassword = propToEditName === 'password' && !verifyUpdatedPassword;

    const closeMessage = () => this.setState({ showMessage: false });

    const style = getStyle();

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title={`${hasCurrentValue ? 'Edit' : 'Add'} ${capPropToEditName}`}
        isCloseButtonDisabled={isLoading}
        footerContent={
          <>
            <Button
              theme="light"
              onClick={() => {
                reset();
                closeModal();
              }}
              disabled={isLoading}
            >
              {hasSuccess ? 'Close' : 'Cancel'}
            </Button>
            <Button
              theme={hasSuccess ? 'success' : 'primary'}
              onClick={submit}
              disabled={
                isLoading || hasSuccess || !updatedAccountProp || !currentPassword || isMissingVerifyPassword
              }
              isSubmit
              {...{
                formId,
                isLoading
              }}
            >
              Submit
            </Button>
          </>
        }
      >
        <form id={formId}>
          {showMessage && !hasProblem && !hasSuccess && (
            <Notification theme="info" close={closeMessage}>
              <NotificationText isLast>
                Complete the form below to update your {propToEditName}.
              </NotificationText>
            </Notification>
          )}
          {showMessage && problemMessages.length > 0 && (
            <Notification theme="danger" close={closeMessage}>
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
                <strong>Success!</strong> Your {propToEditName} was updated.
              </NotificationText>
              <NotificationText>
                This dialog box will close in {Math.floor(secondsUntilRedirect + .5)} seconds...
              </NotificationText>
              <ProgressBar
                theme="success"
                value={secondsToDelayRedirect - secondsUntilRedirect}
                max={secondsToDelayRedirect}
              />
            </Notification>
          )}
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
        </form>
      </ModalSkeleton>
    );
  };
}

const EditAccountModal = addData(_EditAccountModal_needsData, 'user', profileService);

export default EditAccountModal;