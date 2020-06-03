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
import { TextInput, SelectInput, DateInput, WageInput, RadioInput } from '../../formPieces';
import { jobsService, currentJobService } from '../../../data';

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
      cutoff: 40
    }
  },
  dayCutoff: 0,
  weekBegins: 0,
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

class NewJobModal extends Component {
  constructor(props) {
    super(props);
    this.changeHandlerFactory = changeHandlerFactoryFactory().bind(this);
    // this.changeHandlerFactory = this.changeHandlerFactory.bind(this);
    this.radioUseWageTrue = React.createRef();
    this.radioUseWageFalse = React.createRef();
    this.radioUseOvertimeTrue = React.createRef();
    this.radioUseOvertimeFalse = React.createRef();
    this.radioUseMultiplierTrue = React.createRef();
    this.radioUseMultiplierFalse = React.createRef();
    this.state = startingState;
  };

  render() {

    const { state, props, changeHandlerFactory } = this;
    const {
      name, startDate, timezone, useWage, wage, dayCutoff, weekBegins, problems, hasProblem, isLoading, hasSuccess,  problemMessages, showMessage, secondsUntilRedirect
    } = state;
    const { isActive, closeModal, inputRef } = props;

    const isFormActive = isActive && !isLoading && !hasSuccess;

    const topLevelFieldLabelRatio = 5.8;

    const style = getStyle();

    return (
      <ModalSkeleton
        title="Create Job"
        isActive={isActive}
        closeModal={closeModal}
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
            {...{
              changeHandlerFactory,
              formId,
              topLevelFieldLabelRatio
            }}
            isActive={isFormActive}
            hasProblem={problems && problems.wage}
            problems={problems && problems.wage}
            radioUseWageTrueRef={this.radioUseWageTrue}
            radioUseWageFalseRef={this.radioUseWageFalse}
            radioUseOvertimeTrueRef={this.radioUseOvertimeTrue}
            radioUseOvertimeFalseRef={this.radioUseOvertimeFalse}
            radioUseMultiplierTrueRef={this.radioUseMultiplierTrue}
            radioUseMultiplierFalseRef={this.radioUseMultiplierFalse}
          />
        </form>
      </ModalSkeleton>
    );
  };
}

export default NewJobModal;