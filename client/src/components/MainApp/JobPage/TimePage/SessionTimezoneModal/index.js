import React, { Component } from 'react';
import getStyle from './style';
import { currentJobTimeService } from '../../../../../data';
import {
  getTimezoneFullName, getTimezoneOptions, bindFormMethods
} from '../utilities';
import FormModal from '../../../../FormModal';
import Notification from '../../../../Notification';
import Tag, { TagGroup } from '../../../../Tag';
import { SelectInput } from '../../../../formPieces';

const formId = 'change-session-timezone-form';

class SessionTimezoneModal extends Component {
  constructor(props) {
    super(props);
    bindFormMethods(this);
    this.inputRef = React.createRef();
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    return {
      timezoneInputValue: this.props.job.time.sessionTimezone,
      hasSessionTimezone: true,
      showGuessMessage: true
    };
  };

  processAndSubmitData() {
    const { timezoneInputValue, hasSessionTimezone } = this.state;
    currentJobTimeService.setSessionTimezone(
      hasSessionTimezone ? timezoneInputValue : null
    );
  };

  render() {
    const { changeHandlerFactory, inputRef } = this;
    const {
      closeModal,
      isActive,
      job
    } = this.props;
    const { timezoneInputValue, isLoading, hasSuccess, showGuessMessage } = this.state;

    const { sessionTimezone, wasSessionTimezoneGuessed } = job.time;


    if (!isActive) {
      return <></>;
    }

    const style = getStyle();

    return (
      <FormModal
        formMgmtComponent={this}
        infoMessages={[
          <strong>About the Session Timezone</strong>,
          'The "session timezone" is the timezone that all times will be displayed in and all time inputs will be interpretted using.',
          'It does not affect the timezone defined in the job settings.',
          'When the session timezone differs from the job timezone, all times are converted to the session timezone to display. All time input is interpretted in the session timezone and then converted back to the timezone defined by the job settings. The day cutoff time is calculated using the timezone defined in job settings.'
        ]}
        successMessages={[
          <><strong>Success!</strong> The session timezone was updated.</>
        ]}
        successRedirectMessageFragment="This dialog box will close"
        title="Session Timezone Management"
        messagesAreaStyle={style.messagesArea}
        messagesAreaContent={
          <>
            {wasSessionTimezoneGuessed && showGuessMessage && (
              <Notification
                theme="info light"
                messages={[
                  'The current session timezone was automatically set by guessing your timezone using your browser information.'
                ]}
                close={() => this.setState({ showGuessMessage: false })}
              />
            )}
            <TagGroup size="medium" align="center">
              <Tag theme="info">
                Current Session Timezone:
              </Tag>
              <Tag theme="info light">
                {getTimezoneFullName(sessionTimezone)}
              </Tag>
            </TagGroup>
          </>
        }
        {...{
          isActive,
          closeModal,
          formId
        }}
        title="Session Timezone"
        isFormIncomplete={false}
      >
        <SelectInput
          options={getTimezoneOptions()}
          propName="timezoneInputValue"
          value={timezoneInputValue}
          isActive={!isLoading && !hasSuccess}
          {...{
            changeHandlerFactory,
            formId,
            inputRef
          }}
          label="New Timezone:"
          isInline
        />
      </FormModal>
    );
  };
}

export default SessionTimezoneModal;
