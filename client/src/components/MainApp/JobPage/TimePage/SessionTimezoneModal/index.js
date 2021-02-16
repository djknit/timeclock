import React, { Component } from 'react';
import getStyle from './style';
import ModalSkeleton from '../../../../ModalSkeleton';
import FormModal from '../../../../FormModal';
import Notification from '../../../../Notification';

const formId = 'change-session-timezone-form';

class SessionTimezoneModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    const {
      closeModal,
      isActive,
      job
    } = this.props;

    const { sessionTimezone, wasSessionTimezoneGuessed } = job.time;

    if (!isActive) {
      return <></>;
    }

    const style = getStyle();

    return (
      <FormModal
        formMgmtComponent={this}
        infoMessages={[
          'The "session timezone" is the timezone that all times will be displayed in and all time inputs will be interpretted using.',
          'It does not affect the timezone defined in the job settings.',
          'When the session timezone is different than the job timezone, the times are converted to the session timezone to display, and input is converted from the session timezone back to the timezone defined by the job settings.'
        ]}
        successMessages={[
          <><strong>Success!</strong> The session timezone was updated.</>
        ]}
        successRedirectMessageFragment="This dialog box will close"
        title="Session Timezone Management"
        messagesAreaStyle={style.messagesArea}
        messagesAreaContent={wasSessionTimezoneGuessed && (
          <Notification
            messages={[
              'The current session timezone was set by guessing the timezone where you are accessing the internet from.'
            ]}
          />
        )}
        {...{
          isActive,
          closeModal
        }}
        title="Session Timezone"
        footerContent={
          <></>
        }
      >
        time and zone stuff and so on and so on
      </FormModal>
    );
  };
}

export default SessionTimezoneModal;
