import React, { Component } from 'react';
import { profileService } from '../../../data';
import { api, changeHandlerFactoryFactory, capitalizeFirstLetter } from '../utilities';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import Notification, { NotificationText } from '../../Notification';
import { TextInput } from '../../formPieces';
import { addData } from '../../higherOrder';

const startingState = {
  password: '',
  problems: {},
  hasSuccess: false,
  isLoading: false,
  hasProblem: false,
  problemMessages: [],
  showMessage: true,
  hasBeenSubmitted: false
};
const formId = 'delete-account-prop-form';

class _DeleteAccountPropModal_needsData extends Component {
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

  afterChange(propName) {
    
  };

  getInputProblems() {};

  setSubmissionProcessingState() {};

  submit() {

  };

  reset() {
    this.setState()
  };

  componentDidUpdate(prevProps) {
    if (!this.props.isActive && prevProps.isActive) this.reset();
  };

  render() {
    const { props, state, reset, submit } = this;
    const { isActive, closeModal, propToDeleteName, user } = props;
    const {
      password, problems, hasSuccess, isLoading, hasProblem, problemMessages, showMessage, hasBeenSubmitted
    } = state;

    const propToDeleteCurrentValue = user && user[propToDeleteName];
    const capPropToDeleteName = capitalizeFirstLetter(propToDeleteName);

    const closeMessage = () => this.setState({ showMessage: false });

    return (
      <ModalSkeleton
        {...{
          isActive,
          closeModal
        }}
        title={`Delete ${capPropToDeleteName}`}
        isCloseButtonDisabled={isLoading}
        footerContent={
          <>
            <Button
              color="light"
              onClick={() => {
                reset();
                closeModal();
              }}
              disabled={isLoading}
            >
              {hasSuccess ? 'Close' : 'Cancel'}
            </Button>
            <Button
              color={hasSuccess ? 'success' : 'primary'}
              onClick={submit}
              disabled={
                isLoading || hasSuccess || !password
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
        {showMessage && !hasProblem && !hasSuccess && (
          <Notification theme="info" close={closeMessage}>
            <NotificationText>
              You are about to delete your {propToDeleteName}.
            </NotificationText>
            <NotificationText isLast>
              Enter your password to proceed.
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
            <NotificationText isLast>
              <strong>Success!</strong> Your username was deleted.
            </NotificationText>
          </Notification>
        )}
        <div className="tags has-addons has-text-centered" style={{ display: 'block' }}>
          <span className="tag is-info is-size-6">
            {`Current ${capPropToDeleteName}:`}
          </span>
          <span className="tag is-info is-light is-size-6">
            {propToDeleteCurrentValue ? `"${propToDeleteCurrentValue}"` : 'none'}
          </span>
        </div>
      </ModalSkeleton>
    );
  };
}

const DeleteAccountPropModal = addData(_DeleteAccountPropModal_needsData, 'user', profileService);

export default DeleteAccountPropModal;