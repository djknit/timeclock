import React, { Component } from 'react';
import getStyle from './style';
import { preprocessScheduleForDisplay, modalManagement } from '../utilities';
import { windowWidthService } from '../../../../../data';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';
import EditValueModal from '../EditValueModal';
import AddEntryModal from '../AddEntryModal';
import DeleteEntryModal from '../DeleteEntryModal';
import ChangeDateModal from '../ChangeDateModal';
import ValueSchedule from './ValueSchedule';
import { addData } from '../../../../higherOrder';

const {
  addModalsStateAndMethods, createModalInfo, reportModalsClosedFor, extractModalsResources
} = modalManagement;

function getUpdateOperationInfoObj(upOpName, modalComponent) {
  const fullName = `${upOpName}Update`;
  const hasInputRef = upOpName !== 'delete';
  const propToEditOnToggleName = upOpName !== 'add' ? 'entryToEditId' : undefined;
  const focusMethodName = upOpName === 'changeDate' ? 'setFocus' : undefined;
  return createModalInfo(fullName, modalComponent, hasInputRef, propToEditOnToggleName, focusMethodName);
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
    this.setEntryToEditId = this.setEntryToEditId.bind(this);
    let state = {};
    addModalsStateAndMethods(this, state, updateOpsInfo);
    this.state = {
      entryToEditId: undefined,
      ...state,
      modalsRegistrationId: undefined,
    };
  };

  setEntryToEditId(entryId) {
    return new Promise((resolve) => {
      this.setState({ entryToEditId: entryId }, resolve);
    });
  };

  componentWillUnmount() {
    reportModalsClosedFor(this);
  };

  render() {
    const { setEntryToEditId } = this;
    const {
      job,
      settingName,
      settingDisplayName,
      catchApiUnauthorized,
      style,
      areAnyModalsOpen,
      windowWidth,
    } = this.props;
    const { entryToEditId } = this.state;

    const { modals, modalTogglers } = extractModalsResources(this, updateOpsInfo);

    const toggleAddUpdateModal = modalTogglers.addUpdate;
    const toggleEditUpdateModal = modalTogglers.editUpdate;
    const toggleChangeDateUpdateModal = modalTogglers.changeDateUpdate;
    const toggleDeleteUpdateModal = modalTogglers.deleteUpdate;

    const valueSchedule = preprocessScheduleForDisplay(job.settings[settingName], settingName);

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
      entryToEditId,
      setEntryToEditId
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
        {modals.map(
          ({ ModalComponent, toggle, inputRef, isActive, name }) => (
            <ModalComponent
              key={name}
              {...commonModalAttrs}
              {...{
                inputRef,
                isActive
              }}
              closeModal={() => toggle(false)}
            />
          )
        )}
      </>
    );
  };
}

const Setting = addData(_Setting_needsData, 'windowWidth', windowWidthService);

export default Setting;
