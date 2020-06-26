import React, { Component } from 'react';
import getStyle from './style';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import {
  api,
  constants,
  getValidTimezones,
  guessUserTimezone,
  getTimezoneAbbreviation,
  processCurrencyInputValue,
  changeHandlerFactoryFactory,
  validateWageInput,
  processWageInput
} from '../utilities';
import Notification, { NotificationText } from '../../Notification';
import {
  TextInput, SelectInput, DateInput, WageInput, WkDayCutoffsInput, ProgressBar
} from '../../formPieces';
import { jobsService, currentJobService, windowWidthService } from '../../../data';
import { addCollapsing, addData } from '../../higherOrder';

const { stepSizeOfRedirectDelay, secondsToDelayRedirect } = constants;

const formId = 'new-user-form';
const startingState = {
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
const timezoneOptions = getValidTimezones().map(
  tzName => {
    const abbreviation = getTimezoneAbbreviation(tzName);
    return {
      name: `${tzName} (${abbreviation})`,
      value: tzName
    };
  }
);

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
    this.radioUseWageTrue = React.createRef();
    this.radioUseWageFalse = React.createRef();
    this.radioUseOvertimeTrue = React.createRef();
    this.radioUseOvertimeFalse = React.createRef();
    this.radioUseMultiplierTrue = React.createRef();
    this.radioUseMultiplierFalse = React.createRef();
    this.radioUseDefaultCutoffsTrue = React.createRef();
    this.radioUseDefaultCutoffsFalse = React.createRef();
    this.state = { ...startingState };
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
    if (!timezone) {
      problems.timezone = true;
      problemMessages.push('You must select a timezone.');
    }
    if (!cutoffs.useDefaults && !cutoffs.weekBegins && cutoffs.weekBegins !== 0) {
      problems.cutoffs = { weekBegins: true };
      problemMessages.push('Missing week begins day (under "Week and Day Cutoffs").');
    }
    const dayCutoffInMinutes = (cutoffs.dayCutoff.hour || 0) * 60 + (cutoffs.dayCutoff.minute || 0);
    if (!cutoffs.useDefaults && Math.abs(dayCutoffInMinutes) > 12 * 60) {
      problems.cutoffs = {
        dayCutoff: true,
        ...(problems.cutoffs || {})
      };
      problemMessages.push('Invalid day cutoff: can\'t be moved more than 12 hrs in either direction from the actual start of the day (midnight).');
    }
    const wageProblemsInfo = validateWageInput(wage);
    if (wageProblemsInfo) {
      problems.wage = wageProblemsInfo.problems;
      problemMessages.push(...wageProblemsInfo.problemMessages);
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
    this.setState(startingState);
  };

  componentDidUpdate(prevProps) {
    // set collapsing container height each time modal is opened and clear each time modal is closed
    const { isActive, wageContentToggle, cutoffsContentToggle } = this.props;
    if (isActive === prevProps.isActive) return;
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

    const isFormActive = isActive && !isLoading && !hasSuccess;

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
          <TextInput
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
            radioUseWageTrueRef={this.radioUseWageTrue}
            radioUseWageFalseRef={this.radioUseWageFalse}
            radioUseOvertimeTrueRef={this.radioUseOvertimeTrue}
            radioUseOvertimeFalseRef={this.radioUseOvertimeFalse}
            radioUseMultiplierTrueRef={this.radioUseMultiplierTrue}
            radioUseMultiplierFalseRef={this.radioUseMultiplierFalse}
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
            radioUseDefaultCutoffsTrueRef={this.radioUseDefaultCutoffsTrue}
            radioUseDefaultCutoffsFalseRef={this.radioUseDefaultCutoffsFalse}
            contentToggle={cutoffsContentToggle}
          />
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