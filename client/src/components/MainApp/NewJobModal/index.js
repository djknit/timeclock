import React, { Component } from 'react';
import getStyle from './style';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import {
  api, constants, getValidTimezones, guessUserTimezone, getTimezoneAbbreviation, processCurrencyInputValue
} from '../utilities';
import Notification, { NotificationText } from '../../Notification';
import { TextInput, SelectInput, DateInput, WageInput } from '../../formPieces';
import { jobsService, currentJobService } from '../../../data';

const formId = 'new-user-form';
const startingState = {
  name: '',
  startDate: null,
  timezone: guessUserTimezone() || '',
  useWage: false,
  wage: {
    rate: '',
    currency: 'USD',
    useOvertime: true,
    overtime: {
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
    this.handleChange = this.handleChange.bind(this);
    this.state = startingState;
  };

  handleChange(event) {
    const { name, value } = event.target;
    // console.log(name)
    // console.log(value)
    this.setState({
      [name]: value
    });
  };

  render() {

    const { state, props, handleChange } = this;
    const {
      name, startDate, timezone, useWage, wage, dayCutoff, weekBegins, problems, hasProblem, isLoading, hasSuccess,  problemMessages, showMessage, secondsUntilRedirect
    } = state;
    const { isActive, closeModal, inputRef } = props;

    const isFormActive = isActive && !isLoading && !hasSuccess;

    const style = getStyle();

    return (
      <ModalSkeleton
        title="Create Job"
        isActive={isActive}
        closeModal={closeModal}
      >
        <form id={formId}>
          <TextInput
            name="name"
            value={name}
            label="Name:"
            placeholder="Name this job..."
            {...{
              handleChange,
              inputRef,
              formId
            }}
            isInline
            isActive={isFormActive}
            hasProblem={problems && problems.name}
          />
          <DateInput
            isInline
            name="startDate"
            value={startDate}
            label="Start Date:"
            {...{
              handleChange,
              formId
            }}
            isActive={isFormActive}
            hasProblem={problems && problems.startDate}
            placeholder="Type or select date..."
            helpText="If not sure, just guess. An incorrect date will not cause problems."
          />
          <SelectInput
            name="timezone"
            value={timezone}
            options={timezoneOptions}
            {...{
              handleChange,
              formId
            }}
            isInline
            label="Timezone:"
            placeholder="The timezone your hours are counted in..."
            isActive={isFormActive}
            hasProblem={problems && problems.timezone}
          />
          <hr style={style.hr} />
          <WageInput
            name="wage"
            value={wage}
            {...{
              handleChange,
              formId
            }}
            isActive={isFormActive}
            hasProblem={problems && problems.wage}
            problems={problems && problems.wage}
          />
        </form>
      </ModalSkeleton>
    );
  };
}

export default NewJobModal;