import React, { Component } from 'react';
import getStyle from './style';
import { modalManagement } from './utilities';
import PageTitle from '../../PageTitle';
import GeneralEntryModal from './GeneralEntryModal';
import DeleteSegmentModal from './DeleteSegmentModal';
import EditSegmentModal from './EditSegmentModal';
import General from './General';
import Summary from './Summary';
import Weeks from './Weeks';

const {
  addModalsStateAndMethods, reportModalsClosedFor, extractModalsResources, createModalInfo
} = modalManagement;

const modalsInfo = [
  createModalInfo('generalTimeEntry', GeneralEntryModal, false),
  createModalInfo('deleteSegment', DeleteSegmentModal, false, 'segmentToDelete'),
  createModalInfo(
    'editSegment', EditSegmentModal, false, 'segmentToEdit', undefined, 'handleEditSegSuccess'
  )
];

class TimePage extends Component {
  constructor(props) {
    super(props);
    let state = {};
    addModalsStateAndMethods(this, state, modalsInfo);
    this.stateSetterFactory = this.stateSetterFactory.bind(this);
    this.setSegmentToDelete = this.stateSetterFactory('segmentToDelete').bind(this);
    this.setSegmentToEdit = this.stateSetterFactory('segmentToEdit').bind(this);
    this.state = {
      ...state,
      segmentToDelete: undefined,
      segmentToEdit: undefined,
      handleEditSegSuccess: undefined
    };
  };

  stateSetterFactory() {
    return function (stateUpdates) {
      return new Promise(resolve => this.setState(stateUpdates, resolve));
    };
  };
  
  componentWillUnmount() {
    reportModalsClosedFor(this);
  };

  render() {
    const { setSegmentToDelete, setSegmentToEdit } = this;
    const { job, parentPath, windowWidth } = this.props;
    const { segmentToDelete, segmentToEdit, handleEditSegSuccess } = this.state;

    const { modals, modalTogglers } = extractModalsResources(this, modalsInfo);

    const toggleGeneralEntryModal = modalTogglers.generalTimeEntry;
    const toggleDeleteSegmentModal = modalTogglers.deleteSegment;
    const toggleEditSegmentModal = modalTogglers.editSegment;
    

    const variableModalAttrs = {
      generalTimeEntry: {
        toggleDeleteSegmentModal,
        toggleEditSegmentModal,
        windowWidth
      },
      deleteSegment: { segmentToDelete, setSegmentToDelete },
      editSegment: {
        segmentToEdit,
        setSegmentToEdit,
        reportUpdate: handleEditSegSuccess
      }
    };

    const crumbChain = [
      {
        text: <>JOB:&nbsp;{job.name}</>,
        url: parentPath
      },
      { text: 'Time' }
    ];

    const style = getStyle(windowWidth);

    return (
      <>
        <PageTitle {...{ crumbChain }} />
        <div style={style.contentAreasRow}>
          <Summary
            style={style.summaryArea}
            timeData={job.time}
            {...{ windowWidth }}
          />
          <General
            style={style.generalEntryArea}
            {...{
              job,
              toggleGeneralEntryModal,
              toggleDeleteSegmentModal
            }}
          />
        </div>
        <Weeks />
        {modals.map(
          ({ ModalComponent, toggle, inputRef, isActive, name }) => (
            <ModalComponent
              key={name}
              {...{
                isActive,
                inputRef,
                job
              }}
              {...variableModalAttrs[name]}
              closeModal={() => toggle(false)}
            />
          )
        )}
      </>
    );
  };
}

export default TimePage;