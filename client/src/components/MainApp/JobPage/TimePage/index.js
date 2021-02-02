import React, { Component } from 'react';
import getStyle from './style';
import { modalManagement, guessUserTimezone } from './utilities';
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
  createModalInfo('editSegment', EditSegmentModal, false, 'segmentToEdit')
];

class TimePage extends Component {
  constructor(props) {
    super(props);
    let state = {};
    addModalsStateAndMethods(this, state, modalsInfo);
    this.setSegmentToDelete = this.setSegmentToDelete.bind(this);
    this.setSegmentToEdit = this.setSegmentToEdit.bind(this);
    this.state = {
      ...state,
      segmentToDelete: undefined,
      segmentToEdit: undefined,
      segToEditWeekId: undefined,
      segToEditDayId: undefined
    };
  };

  setSegmentToDelete(segmentToDelete) {
    return new Promise(resolve => this.setState({ segmentToDelete }, resolve));
  };

  setSegmentToEdit(segmentToEdit, segToEditWeekId, segToEditDayId) {
    const stateUpdates = { segmentToEdit, segToEditWeekId, segToEditDayId };
    return new Promise(resolve => this.setState(stateUpdates, resolve));
  };
  
  componentWillUnmount() {
    reportModalsClosedFor(this);
  };

  render() {
    const { setSegmentToDelete } = this;
    const { job, parentPath, windowWidth } = this.props;
    const { segmentToDelete, segmentToEdit, segToEditWeekId, segToEditDayId } = this.state;

    const { modals, modalTogglers } = extractModalsResources(this, modalsInfo);

    const toggleGeneralEntryModal = modalTogglers.generalTimeEntry;
    const toggleDeleteSegmentModal = modalTogglers.deleteSegment;
    const toggleEditSegmentModal = modalTogglers.editSegment;

    const variableModalAttrs = {
      generalTimeEntry: { toggleDeleteSegmentModal, toggleEditSegmentModal, windowWidth },
      deleteSegment: { segmentToDelete, setSegmentToDelete },
      editSegment: { segmentToEdit, segToEditWeekId, segToEditDayId }
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