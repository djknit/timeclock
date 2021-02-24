import React, { Component } from 'react';
import getStyle from './style';
import { currentJobTimeService } from '../../../../../data';
import {
  getTimezoneFullName, getTimezoneOptions, bindFormMethods, guessUserTimezone
} from '../utilities';
import FormModal from '../../../../FormModal';
import Notification from '../../../../Notification';
import Tag, { TagGroup } from '../../../../Tag';
import { SelectInput } from '../../../../formPieces';
import Button from '../../../../Button';
import InfoButton from '../../../InfoButton';

const formId = 'change-session-timezone-form';
const guessTimezoneBtnTxt = 'Guess My Timezone'

class SessionTimezoneModal extends Component {
  constructor(props) {
    super(props);
    this.setInputWithGuess = this.setInputWithGuess.bind(this);
    bindFormMethods(this);
    this.inputRef = React.createRef();
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    const { sessionTimezone, wasSessionTimezoneGuessed } = this.props.job.time;
    return {
      timezoneInputValue: sessionTimezone,
      hasSessionTimezone: true,
      showGuessMessage: wasSessionTimezoneGuessed
    };
  };

  setInputWithGuess() {
    this.setState({ timezoneInputValue: guessUserTimezone() });
  };

  processAndSubmitData() {
    const { timezoneInputValue, hasSessionTimezone } = this.state;
    currentJobTimeService.setSessionTimezone(
      hasSessionTimezone ? timezoneInputValue : null
    );
  };

  render() {
    const { changeHandlerFactory, inputRef, setInputWithGuess } = this;
    const {
      closeModal,
      isActive,
      job
    } = this.props;
    const { timezoneInputValue, isLoading, hasSuccess, showGuessMessage } = this.state;

    const { sessionTimezone, wasSessionTimezoneGuessed } = job.time;

    const toggleGuessMsg = _isOpenAfterToggle => {
      this.setState({ showGuessMessage: _isOpenAfterToggle });
    };

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
                  'The current session timezone was automatically set by guessing your timezone using information provided by your browser.'
                ]}
                close={() => toggleGuessMsg(false)}
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
          label="New Session Timezone:"
        />
        {!wasSessionTimezoneGuessed && !hasSuccess && (
          <>
            {showGuessMessage && (
              <Notification
                theme="info light"
                messages={[
                  `When you choose "${guessTimezoneBtnTxt}," information provided by your browser will be used to attempt to guess your current timezone.`
                ]}
                close={() => toggleGuessMsg(false)}
              />
            )}
            <div style={style.guessButtonsField}>
              {!showGuessMessage && (
                // <Button
                //   theme="info light"
                //   style={style.guessInfoButton}
                //   onClick={() => toggleGuessMsg(true)}
                // >
                //   <i className="fas fa-info" style={style.guessInfoIcon} />
                // </Button>
                <InfoButton
                  onClick={() =>  toggleGuessMsg(true)}
                  style={style.guessInfoButton}
                />
              )}
              <Button
                theme="info"
                style={style.guessButton}
                onClick={setInputWithGuess}
              >
                {guessTimezoneBtnTxt}
              </Button>
            </div>
          </>
        )}
      </FormModal>
    );
  };
}

export default SessionTimezoneModal;
