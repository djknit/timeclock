import React, { Component } from 'react';
import { api, changeHandlerFactoryFactory, constants } from '../../utilities';
import ModalSkeleton from '../../../ModalSkeleton';
import Button from '../../../Button';
import Notification, { NotificationText } from '../../../Notification';
import Tag, { TagGroup } from '../../../Tag';
import { TextInput, ProgressBar } from '../../../formPieces';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

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

class DeleteJobModal extends Component {
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

  afterChange() {
    if (this.state.hasBeenSubmitted) this.setState(this.getInputProblems());
  };

  getInputProblems() {
    const { password } = this.state;
    let problems = {};
    let problemMessages = [];
    if (!password) {
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
    const { job, closeModal } = this.props;
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
      return api.jobs.delete(job._id);
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

    });
  };

  reset() {
    this.setState(startingState);
  };

  render() {

    return (
      <ModalSkeleton

      >

      </ModalSkeleton>
    );
  };
}

export default DeleteJobModal;