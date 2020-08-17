import React, { Component } from 'react';
import {
  api, 
  constants,
  changeHandlerFactoryFactory
} from '../utilities';
import { currentJobService } from '../../../../../data';
import ModalSkeleton from '../../../../ModalSkeleton';
import Button from '../../../../Button';
import Notification, { NotificationText } from '../../../../Notification';
import Tag, { TagGroup } from '../../../../Tag';
import { DateInput, ProgressBar } from '../../../../formPieces';

const { secondsToDelayRedirect, stepSizeOfRedirectDelay } = constants;

const fromId = 'change-job-setting-date-form';
function getStartingState(currentStartDate) {
  return {
    hasSuccess: false,
    hasProblem: false,
    isLoading: false,
    problems: {},
    problemMessages: [],
    showMessage: true,
    hasBeenSubmitted: false,
    secondsUntilRedirect: undefined,
    updatedStartDate: currentStartDate
  };
}

class ChangeDateModal extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory(this.afterChange).bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.setSubmissionProcessingState = this.setSubmissionProcessingState.bind(this);
    this.getDataProcessedToSubmit = this.getDataProcessedToSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = getStartingState();
  };

  afterChange() {
    if (this.state.hasBeenSubmitted) {
      this.setState(this.getInputProblems());
    }
  };

  getInputProblems() {
    const { updatedStartDate } = this.state;
    let problems = {};
    let problemMessages = [];
    
    return { problems, problemMessages };
  };

  setSubmissionProcessingState() {

  };

  getDataProcessedToSubmit() {

  };

  submit() {

  };

  reset() {
    
  };

  componentDidMount() {

  };

  render() {
    return (
      <ModalSkeleton

      >

      </ModalSkeleton>
    );
  };
}

export default ChangeDateModal;