import React, { Component } from 'react';
import getStyle from './style';
import { profileService } from '../../../data';
import {
  api, constants, changeHandlerFactoryFactory, capitalizeFirstLetter
} from '../utilities';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import Notification, { NotificationText } from '../../Notification';
import { TextInput, ProgressBar } from '../../formPieces';
import { addData } from '../../higherOrder';

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
const formId = 'edit-account-form';
function getTakenUsernameDisplayMessage(username) {
  return `The username "${username}" is not available.`;
}
function getTakenEmailDisplayMessage(email) {
  return `There is already an account for the email address "${email}".`;
}
const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;
// function getVariableAttributes(propToEditName) {
//   if (propToEditName === 'username') {
//     return {
      
//     };
//   }
//   else if (propToEditName === 'email') {
//     return {};
//   }
//   else if (propToEditName === 'password') {
//     return {};
//   }
//   else throw new Error('invalid account prop name');
// }

class _EditAccountModal_needsData extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory().bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.setSubmissionProcessingState = this.setSubmissionProcessingState.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = { ...startingState };
  };

  afterChange(propName) { // `propName` is the name of property (of state of this component) that was changed
    const { problems, hasBeenSubmitted, problemMessages } = this.state;
    if (!hasBeenSubmitted) return;
    let problemsToKeep, problemMessagesToKeep;
    // if (propName === 'password' && problems.usernameOrEmail) {
    //   problemsToKeep = { usernameOrEmail: true };
    //   problemMessagesToKeep = problemMessages.filter(
    //     message => message.toLowerCase().indexOf('password') === -1
    //   );
    // }
    this.setState(this.getInputProblems(problemsToKeep, problemMessagesToKeep));
  };

  getInputProblems(problemsToKeep, problemMessagesToKeep) {
    let problems = problemsToKeep || {};
    let problemMessages = problemMessagesToKeep || [];
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

  submit() {

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
      user, isActive, propToEditName, closeModal
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
      showMessage
    } = state;

    const isMissingVerifyPassword = propToEditName === 'password' && !verifyUpdatedPassword;

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
              disabled={isLoading || hasSuccess}
            >
              Cancel
            </Button>
            <Button
              theme={hasSuccess ? 'success' : 'primary'}
              onClick={submit}
              disabled={
                isLoading || hasSuccess || !updatedAccountProp || !currentPassword || isMissingVerifyPassword
              }
              formId={formId}
              isSubmit
              isLoading={isLoading}
            >
              Submit
            </Button>
          </>
        }
      >
        

      </ModalSkeleton>
    );
  };
}

const EditAccountModal = addData(_EditAccountModal_needsData, 'user', profileService);

export default EditAccountModal;