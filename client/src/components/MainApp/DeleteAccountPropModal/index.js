import React, { Component } from 'react';
import { profileService } from '../../../data';
import { api, bindFormMethods, capitalizeFirstLetter } from '../utilities';
import FormModal from '../../FormModal';
import Tag, { TagGroup } from '../../Tag';
import { TextInput } from '../../formPieces';
import { addData } from '../../higherOrder';

const formId = 'delete-account-prop-form';

class _DeleteAccountPropModal_needsData extends Component {
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
    if (!password && !problems.password) {
      problems.password = true;
      problemMessages.push('You must enter your password.');
    }
    return { problems, problemMessages };
  };

  processAndSubmitData() {
    return api.auth.editInfo({
      password: this.state.password,
      updatedProps: { [this.props.propToDeleteName]: null }
    });
  };

  processSuccessResponse(response) {
    profileService.setValue(response.data.user);
  };

  afterSuccessCountdown() {
    this.props.closeModal();
  };

  componentDidUpdate(prevProps) {
    if (!this.props.isActive && prevProps.isActive) this.reset();
  };

  render() {
    const { props, state, changeHandlerFactory } = this;
    const { isActive, propToDeleteName, user, inputRef } = props;
    const { password, problems, hasSuccess, isLoading } = state;

    if (!isActive) {
      return <></>;
    }

    const propToDeleteCurrentValue = user && user[propToDeleteName];
    const capPropToDeleteName = capitalizeFirstLetter(propToDeleteName);

    return (
      <FormModal
        formMgmtComponent={this}
        isFormIncomplete={!password}
        {...{
          formId
        }}
        infoMessages={[
          `You are about to delete your ${propToDeleteName}.`,
          'Enter your password to proceed.'
        ]}
        successMessages={[
          <><strong>Success!</strong> Your {propToDeleteName} was deleted.</>
        ]}
        successRedirectMessageFragment="This dialog box will close"
        title={`Delete ${capPropToDeleteName}`}
      >
        <TagGroup align="center">
          <Tag theme="info" size={6}>
            {`Current ${capPropToDeleteName}:`}
          </Tag>
          <Tag theme="info light" size={6}>
            {propToDeleteCurrentValue ? `"${propToDeleteCurrentValue}"` : 'none'}
          </Tag>
        </TagGroup>
        <TextInput
          propName="password"
          value={password}
          label="Password:"
          placeholder="Your password..."
          hasProblem={problems && problems.password}
          iconClass={hasSuccess ? 'fas fa-unlock' : 'fas fa-lock'}
          helpText="Enter your current password to verify you identity and complete the update to your account."
          isActive={!isLoading && !hasSuccess}
          {...{
            changeHandlerFactory,
            formId,
            inputRef
          }}
          type="password"
          isInline
        />
      </FormModal>
    );
  };
}

const DeleteAccountPropModal = addData(_DeleteAccountPropModal_needsData, 'user', profileService);

export default DeleteAccountPropModal;