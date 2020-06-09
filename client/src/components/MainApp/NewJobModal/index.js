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
  changeHandlerFactoryFactory
} from '../utilities';
import Notification, { NotificationText } from '../../Notification';
import { TextInput, SelectInput, DateInput, WageInput, RadioInput, WkDayCutoffsInput } from '../../formPieces';
import { jobsService, currentJobService, windowWidthService } from '../../../data';
import { addCollapsing, addData } from '../../higherOrder';

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

  afterChange(changedPropName) {
    // If `useWage` is on and wage section has never been expanded, expand it automatically.
      // Same goes for cutoffs section.
    const { wage, cutoffs } = this.state;
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
    if (!cutoffs.useDefaults && (Math.abs(dayCutoffInMinutes) > 12 * 60) ) {
      problems.cutoffs = {
        dayCutoff: true,
        ...(problems.cutoffs || {})
      };
      problemMessages.push('Invalid day cutoff: can\'t be adjust more than 12 hours on either side of the start of the calendar day (midnight).');
    }
  };

  submit(event) {
    event.preventDefault();
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
            helpText="If not sure, just guess. An incorrect date will not cause problems."
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