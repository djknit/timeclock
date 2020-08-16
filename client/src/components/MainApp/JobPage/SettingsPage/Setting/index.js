import React, { Component } from 'react';
import getStyle from './style';
import { preprocessScheduleForDisplay } from '../utilities';
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
    this.clearEntryToEditIndex = this.clearEntryToEditIndex.bind(this);
    this.state = {
      indexOfSchedEntryToEdit: undefined,
      isEditValueModalOpen: false,
      isDeleteEntryModalOpen: false,
      isChangeDateModalOpen: false,
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

  clearEntryToEditIndex() {
    return new Promise(resolve => {
      this.setState({ indexOfSchedEntryToEdit: null }, resolve);
    });
  }

  render() {
    const { modalTogglerFactory, clearEntryToEditIndex } = this;
    const {
      job, settingName, settingDisplayName, catchApiUnauthorized, style, areAnyModalsOpen, windowWidth
    } = this.props;
    const {
      indexOfSchedEntryToEdit,
      isEditValueModalOpen,
      isDeleteEntryModalOpen,
      isChangeDateModalOpen,
      isAddEntryModalActive
    } = this.state;
    
    const completeAreModalsOpen = (
      areAnyModalsOpen ||
      isEditValueModalOpen ||
      isDeleteEntryModalOpen ||
      isChangeDateModalOpen ||
      isAddEntryModalActive
    );
    
    const valueSchedule = preprocessScheduleForDisplay(job[settingName], settingName);

    const completeStyle = getStyle(style);

    const toggleEditValueModal = modalTogglerFactory('isEditValueModalOpen');
    const toggleDeleteValueModal = modalTogglerFactory('isDeleteEntryModalOpen');
    const toggleChangeDateModal = modalTogglerFactory('isChangeDateModalOpen');
    const toggleAddEntryModal = modalTogglerFactory('isAddEntryModalActive');

    const jobId = job._id.toString();
    const commonModalAttrs = {
      settingName, settingDisplayName, jobId, catchApiUnauthorized, windowWidth
    };
    const mostlyCommonModalAttrs = { ...commonModalAttrs, indexOfSchedEntryToEdit, valueSchedule };
  
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
          isActive={isEditValueModalOpen}
          closeModal={() => toggleEditValueModal(false)}
        />
        {/* <ChangeDateModal
          {...commonModalAttrs}
        /> */}
        <DeleteEntryModal
          {...mostlyCommonModalAttrs}
          isActive={isDeleteEntryModalOpen}
          closeModal={() => toggleDeleteValueModal(false)}
          {...{ clearEntryToEditIndex }}
        />
      </>
    );
  };
}

const Setting = addData(_Setting_needsData, 'windowWidth', windowWidthService);

export default Setting;