import React, { Component } from 'react';
import getStyle from './style';
import { profileService } from '../../../data';
import { api, constants, changeHandlerFactoryFactory } from '../utilities';
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
function getTakenUsernameDisplayMessage(username) {
  return `The username "${username}" is not available.`;
}
function getTakenEmailDisplayMessage(email) {
  return `There is already an account for the email address "${email}".`;
}
const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

class _EditAccountModal_needsData extends Component {
  constructor(props) {
    super(props);
    this.changeHandlerFactory = changeHandlerFactoryFactory().bind(this);
    this.state = { ...startingState };
  };

  render() {

    const { props, state, changeHandlerFactory } = this;

    const {
      user, isActive
    } = props;

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
        // {...{ isActive }}

      >
        

      </ModalSkeleton>
    );
  };
}

const EditAccountModal = addData(_EditAccountModal_needsData, 'user', profileService);

export default EditAccountModal;