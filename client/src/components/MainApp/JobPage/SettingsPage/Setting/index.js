import React, { Component } from 'react';
import getStyle from './style';
import {
  preprocessScheduleForDisplay,
  getIndexOfSchedEntryFromId
} from '../utilities';
import { windowWidthService, areModalsOpenService } from '../../../../../data';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';
import EditValueModal from '../EditValueModal';
import AddEntryModal from '../AddEntryModal';
import DeleteEntryModal from '../DeleteEntryModal';
import ChangeDateModal from '../ChangeDateModal';
import ValueSchedule from './ValueSchedule';
import { addData } from '../../../../higherOrder';

function getUpdateOperationInfoObj(upOpName, modalComponent) {
  const fullName = `${upOpName}Update`;
  const capFullName = fullName[0].toUpperCase() + fullName.slice(1);
  return {
    name: upOpName,
    togglerName: `toggle${capFullName}Modal`,
    inputRefName: `${fullName}InputRef`,
    isActiveStateProp: `is${capFullName}ModalActive`,
    ModalComponent: modalComponent
  };
}
const updateOpsInfo = [
  getUpdateOperationInfoObj('add', AddEntryModal),
  getUpdateOperationInfoObj('edit', EditValueModal),
  getUpdateOperationInfoObj('delete', DeleteEntryModal),
  getUpdateOperationInfoObj('changeDate', ChangeDateModal)
];

class _Setting_needsData extends Component {
  constructor(props) {
    super(props);
    this.modalTogglerFactory = this.modalTogglerFactory.bind(this);
    let state = {};
    updateOpsInfo.forEach(({ inputRefName, togglerName, isActiveStateProp, name }) => {
      this[inputRefName] = React.createRef();
      const isDateChange = name === 'changeDate';
      this[togglerName] = this.modalTogglerFactory(isActiveStateProp, this[inputRefName], isDateChange).bind(this);
      state[isActiveStateProp] = false;
    });
    this.reportModalActivity = this.reportModalActivity.bind(this);
    this.setEntryToEditById = this.setEntryToEditById.bind(this);
    this.state = {
      indexOfSchedEntryToEdit: undefined,
      ...state,
      modalsRegistrationId: undefined,
    };
  }

  modalTogglerFactory(modalIsOpenStatePropName, inputRef, hasDateInputAsPrimary) {
    return (isOpenAfterToggle, indexOfSchedEntryToEdit) => {
      let stateUpdates = { [modalIsOpenStatePropName]: !!isOpenAfterToggle };
      if (indexOfSchedEntryToEdit || indexOfSchedEntryToEdit === 0) {
        Object.assign(stateUpdates, { indexOfSchedEntryToEdit });
      }
      this.setState(
        stateUpdates,
        () => {
          const focusMethod = hasDateInputAsPrimary ? 'setFocus' : 'focus';
          if (isOpenAfterToggle && inputRef && inputRef.current) {
            inputRef.current[focusMethod]();
          }
          this.reportModalActivity();
        }
      );
    };
  }

  reportModalActivity() {
    let hasModalOpen = false;
    updateOpsInfo.forEach(({ isActiveStateProp }) => {
      if (this.state[isActiveStateProp]) hasModalOpen = true;
    });
    areModalsOpenService.report(this.state.modalsRegistrationId, hasModalOpen);
  }

  setEntryToEditById(entryId) {
    const { job, settingName } = this.props;
    const stateUpdates = {
      indexOfSchedEntryToEdit: getIndexOfSchedEntryFromId(entryId, job[settingName])
    };
    return new Promise((resolve) => {
      this.setState(stateUpdates, resolve);
    });
  }

  componentDidMount() {
    this.setState({
      modalsRegistrationId: areModalsOpenService.getId(),
    });
  }

  componentWillUnmount() {
    areModalsOpenService.report(this.state.modalsRegistrationId, false);
  }

  render() {
    const {
      setEntryToEditById,
      toggleAddUpdateModal,
      toggleEditUpdateModal,
      toggleChangeDateUpdateModal,
      toggleDeleteUpdateModal
    } = this;
    const {
      job,
      settingName,
      settingDisplayName,
      catchApiUnauthorized,
      style,
      areAnyModalsOpen,
      windowWidth,
    } = this.props;
    const { indexOfSchedEntryToEdit } = this.state;

    const valueSchedule = preprocessScheduleForDisplay(job[settingName], settingName);

    const completeStyle = getStyle(style);

    const jobId = job._id.toString();
    const commonModalAttrs = {
      settingName,
      settingDisplayName,
      jobId,
      catchApiUnauthorized,
      windowWidth,
      valueSchedule,
      areAnyModalsOpen,
      indexOfSchedEntryToEdit,
      setEntryToEditById
    };

    return (
      <>
        <ContentArea style={completeStyle.contentArea}>
          <ContentAreaTitle style={completeStyle.areaTitle} {...{ areAnyModalsOpen }}>
            {settingDisplayName} Value Schedule
          </ContentAreaTitle>
          <Button
            styles={completeStyle.addValBtn}
            theme="primary"
            onClick={() => toggleAddUpdateModal(true)}
            allowTabFocus={!areAnyModalsOpen}
          >
            <i className="fas fa-plus" /> Add Value
          </Button>
          <ValueSchedule
            {...{
              valueSchedule,
              settingName,
              areAnyModalsOpen
            }}
            toggleEditValueModal={toggleEditUpdateModal}
            toggleChangeDateModal={toggleChangeDateUpdateModal}
            toggleDeleteValueModal={toggleDeleteUpdateModal}
          />
        </ContentArea>
        {updateOpsInfo.map(({ ModalComponent, togglerName, inputRefName, isActiveStateProp, name }) => (
          <ModalComponent
            key={name}
            {...commonModalAttrs}
            isActive={this.state[isActiveStateProp]}
            closeModal={() => this[togglerName](false)}
            inputRef={this[inputRefName]}
          />
        ))}
      </>
    );
  }
}

const Setting = addData(_Setting_needsData, 'windowWidth', windowWidthService);

export default Setting;
