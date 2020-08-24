import React, { Component } from 'react';
import {
  api,
  constants,
  changeHandlerFactoryFactory,
  getWageInputProblems,
  processWageInput,
  addWageInputRefs,
  addWkDayCutoffsInputRefs,
  extractWageInputRefs,
  extractWkDayCutoffsInputRefs,
  getDayCutoffInputProblems,
  getWeekBeginsInputProblems,
  getTimezoneInputProblems,
  processDayCutoffInput,
  getSettingInputInitialValues
} from '../utilities';
import { jobsService, currentJobService, windowWidthService } from '../../../data';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import Notification, { NotificationText } from '../../Notification';
import { ProgressBar, FormMessages } from '../../formPieces';
import Input from './Input';
import { addCollapsing, addData } from '../../higherOrder';

const { stepSizeOfRedirectDelay, secondsToDelayRedirect } = constants;

const formId = 'new-user-form';
function getStartingState() {
  const settingInputInitialValues = getSettingInputInitialValues();
  return {
    name: '',
    startDate: null,
    timezone: settingInputInitialValues.timezone,
    wage: settingInputInitialValues.wage,
    cutoffs: {
      useDefaults: true,
      dayCutoff: settingInputInitialValues.dayCutoff,
      weekBegins: settingInputInitialValues.weekBegins
    },
    problems: {},
    hasSuccess: false,
    isLoading: false,
    hasProblem: false,
    problemMessages: [],
    showMessage: true,
    hasBeenSubmitted: false,
    secondsUntilRedirect: undefined
  };
}
const inputPropNames = ['name', 'startDate', 'timezone', 'wage', 'cutoffs'];

class _NewJobModal_needsCollapsingAndData extends Component {
  constructor(props) {
    super(props);
    this.afterChange = this.afterChange.bind(this);
    this.changeHandlerFactory = changeHandlerFactoryFactory(this.afterChange).bind(this);
    this.getInputProblems = this.getInputProblems.bind(this);
    this.setSubmissionProcessingState = this.setSubmissionProcessingState.bind(this);
    this.getInputDataProcessedToSubmit = this.getInputDataProcessedToSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    addWageInputRefs(this);
    addWkDayCutoffsInputRefs(this);
    this.state = getStartingState();
  };

  getInputDataProcessedToSubmit() {
    const { name, startDate, timezone, wage, cutoffs } = this.state;
    return {
      name,
      startDate,
      timezone,
      wage: processWageInput(wage),
      weekBegins: cutoffs.weekBegins,
      dayCutoff: processDayCutoffInput(cutoffs.dayCutoff)
    };
  };

  afterChange(changedPropName) {
    const { wage, cutoffs, hasBeenSubmitted } = this.state;
    if (hasBeenSubmitted) {
      this.setState(this.getInputProblems());
    }
    // If `useWage` is on and wage section has never been expanded, expand it automatically.
      // Same goes for cutoffs section.
    const { wageContentToggle, cutoffsContentToggle } = this.props;
    if (changedPropName === 'wage' && wage.useWage && !wageContentToggle.hasBeenExpanded) {
      wageContentToggle.setIsExpanded(true);
    }
    else if (changedPropName === 'cutoffs' && !cutoffs.useDefaults && !cutoffsContentToggle.hasBeenExpanded) {
      cutoffsContentToggle.setIsExpanded(true);
    }
  };

  getInputProblems() {
    const { name, startDate, timezone, wage, cutoffs } = this.state;
    let problems = {};
    let problemMessages = [];
    if (!name) {
      problems.name = true;
      problemMessages.push('You must name the job.');
    }
    else if (jobsService.getValue().map(({ name }) => name).includes(name)) {
      problems.name = true;
      problemMessages.push('You already have a job with that name.');
    }
    if (!startDate) {
      problems.startDate = true;
      problemMessages.push('You must enter a start date');
    }
    problems.timezone = getTimezoneInputProblems(timezone, problemMessages);
    if (!cutoffs.useDefaults) {
      let _cutoffProbs = {};
      _cutoffProbs.dayCutoff = getDayCutoffInputProblems(cutoffs.dayCutoff, problemMessages);
      _cutoffProbs.weekBegins = getWeekBeginsInputProblems(cutoffs.weekBegins, problemMessages, true);
      problems.cutoffs = (_cutoffProbs.dayCutoff || _cutoffProbs.weekBegins) ? _cutoffProbs : undefined;
    }
    problems.wage = getWageInputProblems(wage, problemMessages);
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
    this.setSubmissionProcessingState()
    .then(() => {
      const { problems, problemMessages } = this.getInputProblems();
      if (problemMessages && problemMessages.length > 0) {
        throw { problems, messages: problemMessages };
      }
      const newJob = this.getInputDataProcessedToSubmit();
      return api.jobs.create(newJob);
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
      // * * set currentJob and jobs data * *
      const { jobs, newJob } = res.data;
      jobsService.setJobs(jobs);
      currentJobService.setCurrentJob(newJob);
      const intervalId = setInterval(
        () => {
          secondsUntilRedirect -= stepSizeOfRedirectDelay;
          this.setState({ secondsUntilRedirect });
          if (secondsUntilRedirect <= 0) {
            clearInterval(intervalId);
            this.props.closeModal();
            this.reset();
            this.props.redirectToJobPage(newJob._id);
          }
        },
        1000 * stepSizeOfRedirectDelay
      )
    })
    .catch(err => {
      this.props.catchApiUnauthorized(err);
      const errorData = (err && err.response && err.response.data) || err || {};
      let { problems, messages } = errorData;
      if (!problems) problems = { unknown: true };
      if (!messages) messages = ['An unknown problem has occurred.'];
      this.setState({
        problems,
        problemMessages: messages,
        hasProblem: true,
        isLoading: false,
        showMessage: true
      });
    });
  };

  reset() {
    this.setState(getStartingState());
    this.props.wageContentToggle.reset();
    this.props.cutoffsContentToggle.reset();
  };

  componentDidUpdate(prevProps) {
    // set collapsing container height each time modal is opened and clear each time modal is closed
    const { isActive, wageContentToggle, cutoffsContentToggle, windowWidth } = this.props;
    if (isActive === prevProps.isActive && windowWidth === prevProps.windowWidth) return;
    else if (isActive) {
      wageContentToggle.setHeight();
      cutoffsContentToggle.setHeight();
    }
    else {
      wageContentToggle.clearHeight();
      cutoffsContentToggle.clearHeight();
    }
  };

  render() {

    const { state, props, changeHandlerFactory } = this;
    const {
      problems,
      hasProblem,
      isLoading,
      hasSuccess, 
      problemMessages,
      showMessage,
      secondsUntilRedirect
    } = state;

    const {
      isActive,
      closeModal,
      inputRef,
      wageContentToggle,
      cutoffsContentToggle
    } = props;

    if (!isActive) return <></>;

    return (
      <ModalSkeleton
        title="Create Job"
        isActive={isActive}
        closeModal={closeModal}
        isCloseButtonDisabled={hasSuccess}
        footerContent={
          <>
            <Button
              theme="light"
              onClick={() => {
                this.reset();
                closeModal();
              }}
              disabled={isLoading || hasSuccess}
            >
              Cancel
            </Button>
            <Button
              theme={hasSuccess ? 'success' : 'primary'}
              onClick={this.submit}
              disabled={isLoading || hasSuccess}
              {...{
                formId,
                isLoading
              }}
              isSubmit={true}
            >
              Submit
            </Button>
          </>
        }
      >
        <form id={formId}>
          <FormMessages
            {...{
              showMessage,
              hasSuccess,
              problemMessages,
            }}
            hasProblem={hasProblem}
            infoMessages={[
              'Fill out the form below to add a job and start tracking your hours.',
              'For basic time tracking, only the first three fields are required.',
              'If your settings change during the course of the job, you will be able to enter those changes once the job is created.'
            ]}
            successMessages={[
              <><strong>Success!</strong> New job created.</>,
              <>You are now signed in.</>
            ]}
            successRedirect={{
              secondsToDelayRedirect,
              secondsRemaining: secondsUntilRedirect,
              messageFragment: 'You will be redirected'
            }}
            closeMessage={() => this.setState({ showMessage: false })}
          />
          {inputPropNames.map(
            (propName, index) => (
              <Input
                {...{
                  propName,
                  changeHandlerFactory,
                  formId,
                  wageContentToggle,
                  cutoffsContentToggle
                }}
                value={state[propName]}
                problems={problems && problems[propName]}
                inputRef={index === 0 ? inputRef : undefined}
                isActive={isActive && !isLoading && !hasSuccess}
                topLevelFieldLabelRatio={5.8}
                secondLevelFieldLabelRatio={4.7}
                wageInputRefs={extractWageInputRefs(this)}
                wkDayCutoffsInputRefs={extractWkDayCutoffsInputRefs(this)}
                key={index}
              />
            )
          )}
        </form>
      </ModalSkeleton>
    );
  };
}

const _NewJobModal_needsCollapsing = addData(_NewJobModal_needsCollapsingAndData, 'windowWidth', windowWidthService);

const _NewJobModal_needsMoreCollapsing = (
  addCollapsing(_NewJobModal_needsCollapsing, 'wageContentToggle', false, true)
);

const NewJobModal = (
  addCollapsing(_NewJobModal_needsMoreCollapsing, 'cutoffsContentToggle', false, true)
);

export default NewJobModal;