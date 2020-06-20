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
    this.changeHandlerFactory = changeHandlerFactoryFactory().bind(this);
    this.reset = this.reset.bind(this);
    this.state = { ...startingState };
  };

  afterChange(propName) { // `propName` is the name of property (of state of this component) that was changed

  };

  getInputProblems(problemsToKeep, problemMessagesToKeep) {
    let problems = problemsToKeep || {};
    let problemMessages = problemMessagesToKeep || [];
  };

  reset() {

  };

  render() {

    const { props, state, changeHandlerFactory } = this;

    const {
      user, isActive, propToEditName, closeModal
    } = props;
    const propToEditCurrentValue = user && user[propToEditName];
    const capPropToEditName = capitalizeFirstLetter(propToEditName);

    const {
      updatedAccountProp,
      verifyPassword,
      problems,
      hasSuccess,
      isLoading,
      hasProblem,
      problemMessages,
      showMessage
    } = state;

    const style = getStyle();


    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title={`${propToEditCurrentValue ? 'Edit' : 'Add'} ${capPropToEditName}`}
        isCloseButtonDisabled={hasSuccess}
        footerContent={
          <>
            <Button
              color="light"
              onClick={() => {
                this.reset();
                closeModal();
              }}
              disabled={isLoading || hasSuccess}
            >
              Cancel
            </Button>
            <Button
              color={hasSuccess ? 'success' : 'primary'}
              onClick={this.submit}
              disabled={isLoading || hasSuccess || !updatedAccountProp || !verifyPassword}
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