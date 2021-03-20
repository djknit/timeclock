import React, { Component } from 'react';
import {
  api,
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
  getSettingInputInitialValues,
  bindFormMethods,
  extractFormContainerRef
} from '../utilities';
import { jobsService, currentJobService, windowWidthService } from '../../../data';
import Input from './Input';
import { addCollapsing, addData } from '../../higherOrder';
import FormModal from '../../FormModal';

const formId = 'new-user-form';
const inputPropNames = ['name', 'startDate', 'timezone', 'wage', 'cutoffs'];

class _NewJobModal_needsCollapsingAndData extends Component {
  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    addWageInputRefs(this);
    addWkDayCutoffsInputRefs(this);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
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
      }
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

  processAndSubmitData() {
    const { name, startDate, timezone, wage, cutoffs } = this.state;
    const newJob = {
      name,
      startDate,
      timezone,
      wage: processWageInput(wage),
      weekBegins: cutoffs.weekBegins,
      dayCutoff: processDayCutoffInput(cutoffs.dayCutoff)
    };
    return api.jobs.create(newJob);
  };

  processSuccessResponse(response) {
    const { jobs, newJob } = response.data;
    jobsService.setValue(jobs);
    currentJobService.setValue(newJob);
  };

  afterSuccessCountdown() {
    const newJob = currentJobService.getValue();
    this.props.redirectToJobPage(newJob._id);
    this.props.closeModal();
  };

  reset() {
    this.setState(this.getStartingState());
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
      isLoading,
      hasSuccess, 
      name,
      startDate
    } = state;

    const {
      isActive,
      inputRef,
      wageContentToggle,
      cutoffsContentToggle
    } = props;

    if (!isActive) return <></>;

    const bodyRef = extractFormContainerRef(this);
    console.log('bodyRef:\n', bodyRef);

    return (
      <FormModal
        formMgmtComponent={this}
        isFormIncomplete={!name || !startDate}
        {...{
          formId
        }}
        infoMessages={[
          'Fill out the form below to add a job and start tracking your hours.',
          'For basic time tracking, only the first three fields are required.',
          'If your settings change during the course of the job, you will be able to enter those changes once the job is created.'
        ]}
        successMessages={[
          <><strong>Success!</strong> New job created.</>,
          <>You are now signed in.</>
        ]}
        successRedirectMessageFragment="You will be redirected"
        title="Create Job"
        disableCloseOnSuccess
      >
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
      </FormModal>
    );
  };
}

const _NewJobModal_needsCollapsing = (
  addData(_NewJobModal_needsCollapsingAndData, 'windowWidth', windowWidthService)
);

const _NewJobModal_needsMoreCollapsing = (
  addCollapsing(_NewJobModal_needsCollapsing, 'wageContentToggle', false, true)
);

const NewJobModal = (
  addCollapsing(_NewJobModal_needsMoreCollapsing, 'cutoffsContentToggle', false, true)
);

export default NewJobModal;