import React, { Component } from 'react';
import getStyle from './style';
import { preprocessScheduleForDisplay, getIndexOfSchedEntryFromId } from '../utilities';
import { windowWidthService } from '../../../../../data';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';
import EditValueModal from '../EditValueModal';
import AddEntryModal from '../AddEntryModal';
import DeleteEntryModal from '../DeleteEntryModal';
import ChangeDateModal from '../ChangeDateModal';
import ValueSchedule from './ValueSchedule';
import { addData } from '../../../../higherOrder';

class _Setting_needsData extends Component {
  constructor(props) {
    super(props);
    this.modalTogglerFactory = this.modalTogglerFactory.bind(this);
    this.setEntryToEditById = this.setEntryToEditById.bind(this);
    this.state = {
      indexOfSchedEntryToEdit: undefined,
      isEditValueModalActive: false,
      isDeleteEntryModalActive: false,
      isChangeDateModalActive: false,
      isAddEntryModalActive: false
    };
  };

  modalTogglerFactory(modalIsOpenStatePropName) {
    return (isOpenAfterToggle, indexOfSchedEntryToEdit) => {
      const isOpenState = { [modalIsOpenStatePropName]: !!isOpenAfterToggle };
      this.setState(
        indexOfSchedEntryToEdit || indexOfSchedEntryToEdit === 0 ?
        { ...isOpenState, indexOfSchedEntryToEdit } :
        isOpenState
      );
    };
  };

  setEntryToEditById(entryId) {
    const { job, settingName } = this.props;
    return new Promise(resolve => {
      this.setState(
        { indexOfSchedEntryToEdit: getIndexOfSchedEntryFromId(entryId, job[settingName]) },
        resolve
      );
    });
  };

  render() {
    const { modalTogglerFactory, setEntryToEditById } = this;
    const {
      job, settingName, settingDisplayName, catchApiUnauthorized, style, areAnyModalsOpen, windowWidth
    } = this.props;
    const {
      indexOfSchedEntryToEdit,
      isEditValueModalActive,
      isDeleteEntryModalActive,
      isChangeDateModalActive,
      isAddEntryModalActive
    } = this.state;
    
    const completeAreModalsOpen = (
      areAnyModalsOpen ||
      isEditValueModalActive ||
      isDeleteEntryModalActive ||
      isChangeDateModalActive ||
      isAddEntryModalActive
    );
    
    const valueSchedule = preprocessScheduleForDisplay(job[settingName], settingName);

    const completeStyle = getStyle(style);

    const toggleEditValueModal = modalTogglerFactory('isEditValueModalActive');
    const toggleDeleteValueModal = modalTogglerFactory('isDeleteEntryModalActive');
    const toggleChangeDateModal = modalTogglerFactory('isChangeDateModalActive');
    const toggleAddEntryModal = modalTogglerFactory('isAddEntryModalActive');

    const jobId = job._id.toString();
    const commonModalAttrs = {
      settingName,
      settingDisplayName,
      jobId,
      catchApiUnauthorized,
      windowWidth,
      valueSchedule
    };
    const mostlyCommonModalAttrs = { ...commonModalAttrs, indexOfSchedEntryToEdit };
    const lessCommonModalAttrs = { ...mostlyCommonModalAttrs, setEntryToEditById };
  
    return (
      <>
        <ContentArea style={completeStyle.contentArea}>
          <ContentAreaTitle style={completeStyle.areaTitle}>
            {settingDisplayName} Value Schedule
          </ContentAreaTitle>
          <Button
            styles={completeStyle.addValBtn}
            theme="primary"
            onClick={() => toggleAddEntryModal(true)}
            allowTabFocus={completeAreModalsOpen}
          >
            <i className="fas fa-plus"/> Add Value
          </Button>
          <ValueSchedule
            {...{
              valueSchedule,
              toggleEditValueModal,
              toggleDeleteValueModal,
              toggleChangeDateModal,
              settingName
            }}
          />
        </ContentArea>
        <AddEntryModal
          {...commonModalAttrs}
          isActive={isAddEntryModalActive}
          closeModal={() => toggleAddEntryModal(false)}
        />
        <EditValueModal
          {...mostlyCommonModalAttrs}
          isActive={isEditValueModalActive}
          closeModal={() => toggleEditValueModal(false)}
        />
        <ChangeDateModal
          {...lessCommonModalAttrs}
          isActive={isChangeDateModalActive}
          closeModal={() => toggleChangeDateModal(false)}
        />
        <DeleteEntryModal
          {...lessCommonModalAttrs}
          isActive={isDeleteEntryModalActive}
          closeModal={() => toggleDeleteValueModal(false)}
        />
      </>
    );
  };
}

const Setting = addData(_Setting_needsData, 'windowWidth', windowWidthService);

export default Setting;