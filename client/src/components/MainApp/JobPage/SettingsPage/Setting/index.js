import React, { Component } from 'react';
import getStyle from './style';
import { formatMyDate } from '../../utilities';
import ContentArea from '../../../ContentArea';
import Button from '../../../../Button';
import EditValueModal from '../EditValueModal';
import DeleteValueModal from '../DeleteValueModal';
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
    const { job, settingName, settingDisplayName, catchApiUnauthorized } = this.props;
    const {
      indexOfSchedEntryToEdit, isEditValueModalOpen, isDeleteValueModalOpen, isChangeDateModalOpen
    } = this.state;
    
    const valueSchedule = job[settingName];

    const style = getStyle();

    const toggleEditValueModal = modalTogglerFactory('isEditValueModalOpen');
    const toggleDeleteValueModal = modalTogglerFactory('isDeleteValueModalOpen');
    const toggleChangeDateModal = modalTogglerFactory('isChangeDateModalOpen');
  
    const jobId = job._id.toString();
    const commonModalAttrs = {
      settingName, settingDisplayName, indexOfSchedEntryToEdit, valueSchedule, jobId, catchApiUnauthorized
    };
  
    return (
      <>
        <ContentArea title={`${settingDisplayName} Value Schedule`}>
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
        />
        <DeleteValueModal
          {...commonModalAttrs}
        /> */}
      </>
    );
  };
}

export default Setting;