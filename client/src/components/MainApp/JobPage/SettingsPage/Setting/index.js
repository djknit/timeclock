import React, { Component } from 'react';
import getStyle from './style';
import { formatMyDate } from '../../utilities';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';
import EditValueModal from '../EditValueModal';
import AddEntryModal from '../AddEntryModal';
import DeleteEntryModal from '../DeleteEntryModal';
import ChangeDateModal from '../ChangeDateModal';
import ValueSchedule from './ValueSchedule';

class Setting extends Component {
  constructor(props) {
    super(props);
    this.modalTogglerFactory = this.modalTogglerFactory.bind(this);
    this.state = {
      indexOfSchedEntryToEdit: undefined,
      isEditValueModalOpen: false,
      isDeleteValueModalOpen: false,
      isChangeDateModalOpen: false
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

  render() {
    const { modalTogglerFactory } = this;
    const { job, settingName, settingDisplayName, catchApiUnauthorized, style, areAnyModalsOpen } = this.props;
    const {
      indexOfSchedEntryToEdit, isEditValueModalOpen, isDeleteValueModalOpen, isChangeDateModalOpen
    } = this.state;
    
    const completeAreModalsOpen = (
      areAnyModalsOpen || isEditValueModalOpen || isDeleteValueModalOpen || isChangeDateModalOpen
    );
    
    const valueSchedule = job[settingName];

    const completeStyle = getStyle(style);

    const toggleEditValueModal = modalTogglerFactory('isEditValueModalOpen');
    const toggleDeleteValueModal = modalTogglerFactory('isDeleteValueModalOpen');
    const toggleChangeDateModal = modalTogglerFactory('isChangeDateModalOpen');
  
    const jobId = job._id.toString();
    const commonModalAttrs = {
      settingName, settingDisplayName, indexOfSchedEntryToEdit, valueSchedule, jobId, catchApiUnauthorized
    };
  
    return (
      <>
        <ContentArea style={completeStyle.contentArea}>
          <ContentAreaTitle style={completeStyle.areaTitle}>
            {settingDisplayName} Value Schedule
          </ContentAreaTitle>
          <Button
            styles={completeStyle.addValBtn}
            theme="primary"
            onClick={() => null}
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
        <EditValueModal
          {...commonModalAttrs}
          isActive={isEditValueModalOpen}
          closeModal={() => toggleEditValueModal(false)}
        />
        {/* <ChangeDateModal
          {...commonModalAttrs}
        /> */}
        <DeleteEntryModal
          {...commonModalAttrs}
          isActive={isDeleteValueModalOpen}
          closeModal={() => toggleDeleteValueModal(false)}
        />
      </>
    );
  };
}

export default Setting;