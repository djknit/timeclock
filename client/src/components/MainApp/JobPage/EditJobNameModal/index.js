import React, { Component } from 'react';
import { jobsService, currentJobService } from '../../../../data';
import { api, bindFormMethods } from '../../utilities';
import FormModal from '../../../FormModal';
import Tag, { TagGroup } from '../../../Tag';
import { TextInput } from '../../../formPieces';

const formId = 'edit-job-name-form';

class EditJobNameModal extends Component {
  constructor(props) {
    super(props);
    bindFormMethods(this);
    this.state = this.getStartingState();
  };

  getUniqueStartingState() {
    return { updatedJobName: '' };
  };

  getInputProblems() {
    const { updatedJobName } = this.state;
    let problems = {};
    let problemMessages = [];
    if (!updatedJobName) {
      problems.updatedJobName = true;
      problemMessages.push('You must enter a new job name.');
    }
    else if (jobsService.getValue().map(job => job.name).includes(updatedJobName)) {
      problems.updatedJobName = true;
      problemMessages.push(
        `You already have a job with the name "${updatedJobName}". Each job must have a unique name.`
      );
    }
    return { problems, problemMessages };
  };

  processAndSubmitData() {
    return api.jobs.rename({
      jobId: this.props.job._id,
      name: this.state.updatedJobName
    });
  };

  processSuccessResponse(response) {
    currentJobService.updateCurrentJob(response.data);
  };

  afterSuccessCountdown() {
    this.props.closeModal();
  };

  componentDidUpdate(prevProps) { // Not needed unless job ever changes without leaving job page.
    const currentJobId = this.props.job && this.props.job._id.toString();
    const previousJobId = prevProps.job && prevProps.job._id.toString();
    if (currentJobId !== previousJobId) this.reset();
  };

  render() {

    const { props, state, changeHandlerFactory } = this;

    const {
      job, isActive, inputRef
    } = props;

    const {
      updatedJobName,
      problems,
      hasSuccess,
      isLoading,
    } = state;

    if (!isActive) {
      return <></>;
    }

    return (
      <FormModal
        formMgmtComponent={this}
        isFormIncomplete={!updatedJobName}
        {...{
          formId
        }}
        infoMessages={['Complete the form below to rename this job.']}
        successMessages={[
          <>
            <strong>Success!</strong> The name for this job was updated.
          </>
        ]}
        successRedirectMessageFragment="This dialog box will close"
        title="Edit Job Name"
      >
        <TagGroup align="center">
          <Tag theme="info" size={6}>
            Current Name:
          </Tag>
          <Tag theme="info light" size={6}>
            "{job.name}"
          </Tag>
        </TagGroup>
        <TextInput
          propName="updatedJobName"
          value={updatedJobName}
          hasProblem={problems && problems.updatedJobName}
          isActive={!isLoading && !hasSuccess}
          type="text"
          label={<>New&nbsp;Name:</>}
          placeholder="New job name..."
          isInline
          {...{
            changeHandlerFactory,
            formId,
            inputRef,
          }}
        />
      </FormModal>
    );
  };
}

export default EditJobNameModal;