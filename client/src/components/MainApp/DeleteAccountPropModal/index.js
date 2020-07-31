import React, { Component } from 'react';
import { profileService } from '../../../data';
import { api, changeHandlerFactoryFactory, capitalizeFirstLetter, constants } from '../utilities';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import Notification, { NotificationText } from '../../Notification';
import Tag, { TagGroup } from '../../Tag';
import { TextInput, ProgressBar } from '../../formPieces';
import { addData } from '../../higherOrder';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

function getStartingState() {
  return {
    password: '',
    problems: {},
    hasSuccess: false,
    isLoading: false,
    hasProblem: false,
    problemMessages: [],
    showMessage: true,
    hasBeenSubmitted: false
  };
}
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
    this.state = getStartingState();
  };

  afterChange(propName) {
    if (this.state.hasBeenSubmitted) this.setState(this.getInputProblems());
  };

  getInputProblems(problemsToKeep, problemMessagesToKeep) {
    const { password } = this.state;
    let problems = problemsToKeep || {};
    let problemMessages = problemMessagesToKeep || [];
    if (!password && !problems.password) {
      problems.password = true;
      problemMessages.push('You must enter your password.');
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
    const { propToDeleteName, closeModal } = this.props;
    const { password } = this.state;
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
        password,
        updatedProps: {
          [propToDeleteName]: null
        }
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
      const errorData = (err && err.response && err.response.data) || err || {};
      const { problems, messages } = errorData;
      this.setState({
        problems: problems || { unknown: true },
        problemMessages: messages || ['An unknown problem has occured.'],
        hasProblem: true,
        isLoading: false,
        showMessage: true
      });
    });
  };

  reset() {
    this.setState(getStartingState());
  };

  componentDidUpdate(prevProps) {
    if (!this.props.isActive && prevProps.isActive) this.reset();
  };

  render() {
    const { props, state, reset, submit, changeHandlerFactory } = this;
    const { isActive, closeModal, propToDeleteName, user, inputRef } = props;
    const {
      password, problems, hasSuccess, isLoading, hasProblem, problemMessages, showMessage, secondsUntilRedirect
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
                isLoading || hasSuccess || !password
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
              <NotificationText>
                <strong>Success!</strong> Your {propToDeleteName} was deleted.
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
          <TagGroup align="center">
            <Tag theme="info" size={6}>
              {`Current ${capPropToDeleteName}:`}
            </Tag>
            <Tag theme="info light" size={6}>
              {propToDeleteCurrentValue ? `"${propToDeleteCurrentValue}"` : 'none'}
            </Tag>
          </TagGroup>
          <TextInput
            propName="password"
            value={password}
            label="Password:"
            placeholder="Your password..."
            hasProblem={problems && problems.password}
            iconClass={hasSuccess ? 'fas fa-unlock' : 'fas fa-lock'}
            helpText="Enter your current password to verify you identity and complete the update to your account."
            isActive={!isLoading && !hasSuccess}
            {...{
              changeHandlerFactory,
              formId,
              inputRef
            }}
            type="password"
            isInline
          />
        </form>
      </ModalSkeleton>
    );
  };
}

const DeleteAccountPropModal = addData(_DeleteAccountPropModal_needsData, 'user', profileService);

export default DeleteAccountPropModal;