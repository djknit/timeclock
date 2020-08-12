import React, { Component } from 'react';
import getStyle from './style';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import {
  api,
  constants,
  guessUserTimezone,
  getTimezoneOptions,
  changeHandlerFactoryFactory,
  getWageInputProblems,
  processWageInput,
  addWageInputRefs,
  addWkDayCutoffsInputRefs,
  extractWageInputRefs,
  extractWkDayCutoffsInputRefs,
  getDayCutoffInputProblems,
  getWeekBeginsInputProblems,
  getTimezoneInputProblems
} from '../utilities';
import Notification, { NotificationText } from '../../Notification';
import {
  TextInput, SelectInput, DateInput, WageInput, WkDayCutoffsInput, ProgressBar
} from '../../formPieces';
import { jobsService, currentJobService, windowWidthService } from '../../../data';
import { addCollapsing, addData } from '../../higherOrder';

const { stepSizeOfRedirectDelay, secondsToDelayRedirect } = constants;

const formId = 'new-user-form';
function getStartingState() {
  return {
    name: '',
    startDate: null,
    timezone: guessUserTimezone() || '',
    wage: {
      useWage: false,
      rate: '',
      currency: 'USD',
      overtime: {
        useOvertime: true,
        useMultiplier: true,
        multiplier: 1.5,
        rate: '',
        cutoff: {
          hours: 40,
          minutes: 0
        }
      }
    },
    cutoffs: {
      useDefaults: true,
      dayCutoff: {
        hour: 0,
        minute: 0,
        is24hr: false
      },
      weekBegins: 0
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
const timezoneOptions = getTimezoneOptions();
const inputs = [
  getInputInfoObj('name', TextInput, 'Name:', 'Name this job...'),
  getInputInfoObj(
    'startDate',
    DateInput,
    'Start Date:',
    'Type or select date...',
    'Time can still be entered from before start date, so don\'t worry if you need to guess.'
  ),
  getInputInfoObj(
    'timezone',
    SelectInput,
    'Timezone:',
    'The timezone your hours are counted in...',
    undefined,
    undefined,
    { options: timezoneOptions }
  ),
  getInputInfoObj('wage', WageInput, undefined, undefined, undefined, true),
  getInputInfoObj('cutoffs', WkDayCutoffsInput, undefined, undefined, undefined, true)
];
function getInputInfoObj(propName, Comp, label, placeholder, helpText, isComplex, otherAttrs) {
  return { propName, Comp, label, placeholder, helpText, isComplex, otherAttrs };
}

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
    const dayCutoffInMinutes = (cutoffs.dayCutoff.hour || 0) * 60 + (cutoffs.dayCutoff.minute || 0);
    return {
      name,
      startDate,
      timezone,
      wage: processWageInput(wage),
      weekBegins: cutoffs.weekBegins,
      dayCutoff: dayCutoffInMinutes * 60 * 1000
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
    else if (jobsService.getValue().map(({ name }) => name).indexOf(name) !== -1) {
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
      name,
      startDate,
      timezone,
      wage,
      cutoffs,
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
      cutoffsContentToggle,
      windowWidth
    } = props;

    if (!isActive) return <></>;
    
    const isFormActive = isActive && !isLoading && !hasSuccess;

    const wageInputRefs = extractWageInputRefs(this);
    const cutoffsInputRefs = extractWkDayCutoffsInputRefs(this);
    const inputRefs = {
      wage: extractWageInputRefs(this),
      cutoffs: extractWkDayCutoffsInputRefs(this)
    };
    const contentToggles = {
      wage: wageContentToggle,
      cutoffs: cutoffsContentToggle
    };

    const topLevelFieldLabelRatio = 5.8;
    const secondLevelFieldLabelRatio = 4.7;

    const style = getStyle();

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
          {showMessage && !hasProblem && !hasSuccess && (
            <Notification theme="info" close={() => this.setState({ showMessage: false })}>
              <NotificationText>
                Fill out the form below to add a job and start tracking your hours.
              </NotificationText>
              <NotificationText>
                For basic time tracking, only the first three fields are required.
              </NotificationText>
              <NotificationText isLast={true}>
                If your settings change during the course of the job, you will be able to enter those changes once the job is created.
              </NotificationText>
            </Notification>
          )}
          {showMessage && problemMessages.length > 0 && (
            <Notification theme="danger" close={() => this.setState({ showMessage: false })}>
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
                <strong>Success!</strong> New job created.
              </NotificationText>
              <NotificationText>
                You will be redirected in {Math.floor(secondsUntilRedirect + .5)} seconds...
              </NotificationText>
              <ProgressBar
                theme="success"
                value={secondsToDelayRedirect - secondsUntilRedirect}
                max={secondsToDelayRedirect}
              />
            </Notification>
          )}
          {inputs.map(
            ({ propName, Comp, label, placeholder, helpText, isComplex, otherAttrs }, index) => (
              <Comp
                value={state[propName]}
                {...{
                  propName,
                  label,
                  placeholder,
                  helpText,
                  changeHandlerFactory,
                  formId
                }}
                inputRef={index === 0 ? inputRef : undefined}
                isActive={isFormActive}
                hasProblem={problems && problems[propName]}
                {...(
                  isComplex ? (
                    {
                      problems: problems && problems[propName],
                      refs: inputRefs[propName],
                      contentToggle: contentToggles[propName],
                      topLevelFieldLabelRatio,
                      secondLevelFieldLabelRatio
                    }
                  ) : (
                    {
                      fieldToLabelRatio: topLevelFieldLabelRatio,
                      isInline: true
                    }
                  )
                )}
                {...otherAttrs}
                key={index}
              />
            )
          )}
          {/* <TextInput
            propName="name"
            value={name}
            label="Name:"
            placeholder="Name this job..."
            {...{
              changeHandlerFactory,
              inputRef,
              formId
            }}
            isInline
            isActive={isFormActive}
            hasProblem={problems && problems.name}
            fieldToLabelRatio={topLevelFieldLabelRatio}
          />
          <DateInput
            isInline
            propName="startDate"
            value={startDate}
            label="Start Date:"
            placeholder="Type or select date..."
            {...{
              changeHandlerFactory,
              formId
            }}
            isActive={isFormActive}
            hasProblem={problems && problems.startDate}
            helpText="Time can still be entered from before start date, so don't worry if you need to guess."
            fieldToLabelRatio={topLevelFieldLabelRatio}
          />
          <SelectInput
            propName="timezone"
            value={timezone}
            label="Timezone:"
            placeholder="The timezone your hours are counted in..."
            options={timezoneOptions}
            {...{
              changeHandlerFactory,
              formId
            }}
            isInline
            isActive={isFormActive}
            hasProblem={problems && problems.timezone}
            fieldToLabelRatio={topLevelFieldLabelRatio}
          />
          <WageInput
            propName="wage"
            value={wage}
            isActive={isFormActive}
            hasProblem={problems && problems.wage}
            problems={problems && problems.wage}
            {...{
              changeHandlerFactory,
              formId,
              topLevelFieldLabelRatio,
              secondLevelFieldLabelRatio
            }}
            refs={wageInputRefs}
            contentToggle={wageContentToggle}
          />
          <WkDayCutoffsInput
            propName="cutoffs"
            value={cutoffs}
            isActive={isFormActive}
            hasProblem={problems && problems.cutoffs}
            problems={problems && problems.cutoffs}
            {...{
              changeHandlerFactory,
              formId,
              topLevelFieldLabelRatio,
              secondLevelFieldLabelRatio
            }}
            refs={cutoffsInputRefs}
            contentToggle={cutoffsContentToggle}
          /> */}
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