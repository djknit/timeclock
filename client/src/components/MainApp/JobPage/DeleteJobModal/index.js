import React, { Component } from 'react';
import { api, bindFormMethods } from '../../utilities';
import FormModal from '../../../FormModal';
import { jobsService, currentJobService } from '../../../../data';
import { TextInput } from '../../../formPieces';

const formId = 'delete-job-modal';

class DeleteJobModal extends Component {
  constructor(props) {
    super(props);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    return { password: '' };
  };

  getInputProblems() {
    const { password } = this.state;
    let problems = {};
    let problemMessages = [];
    if (!password) {
      problems.password = true;
      problemMessages.push('You must enter your password.');
    }
    return { problems, problemMessages };
  };

  processAndSubmitData() {
    return api.jobs.delete({
      jobId: this.props.job._id,
      password: this.state.password
    });
  };

  processSuccessResponse() {
    jobsService.removeJob(this.props.job._id);
  };

  afterSuccessCountdown() {
    this.props.returnToDashboard();
    currentJobService.clearValue();
  };

  render() {
    const { props, state, changeHandlerFactory } = this;
    const { isActive, job, inputRef } = props;
    const { password, problems, hasSuccess, isLoading } = state;

    if (!isActive) {
      return <></>;
    }

    return (
      <FormModal
        formMgmtComponent={this}
        isFormIncomplete={!password}
        {...{
          formId
        }}
        infoMessages={[
          `You are about to permanently this job ("${job.name}").`,
          <>You will <strong>not</strong> be able to restore the job once it is deleted.</>
        ]}
        successMessages={[
          <><strong>Success!</strong> The job "{job.name}" was deleted.</>
        ]}
        successRedirectMessageFragment="You will be redirected"
        title="Delete Job"
        disableCloseOnSuccess
      >
        <TextInput
          propName="password"
          value={password}
          label="Enter Your Password to Continue"
          placeholder="Your password..."
          hasProblem={problems && problems.password}
          iconClass={hasSuccess ? 'fas fa-unlock' : 'fas fa-lock'}
          isActive={!isLoading && !hasSuccess}
          {...{
            changeHandlerFactory,
            formId,
            inputRef
          }}
          type="password"
        />
      </FormModal>
    );
  };
}

export default DeleteJobModal;