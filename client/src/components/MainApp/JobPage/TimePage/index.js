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
  createModalInfo('generalTimeEntry', GeneralEntryModal, false, undefined, 'setFocus'),
  createModalInfo('deleteSegment', DeleteSegmentModal, false, 'segmentToDelete'),
  // createModalInfo('editSegment', EditSegmentModal, true, 'segmentToEdit')
];

class TimePage extends Component {
  constructor(props) {
    super(props);
    let state = {};
    addModalsStateAndMethods(this, state, modalsInfo);
    this.state = {
      ...state,
      segmentToDelete: undefined,
      segmentToEdit: undefined
    };
  };

  componentWillUnmount() {
    reportModalsClosedFor(this);
  };

  render() {

    const { job, parentPath, windowWidth } = this.props;
    const { segmentToDelete, segmentToEdit } = this.state;

    const { modals, modalTogglers } = extractModalsResources(this, modalsInfo);

    const toggleGeneralEntryModal = modalTogglers.generalTimeEntry;
    const toggleDeleteSegmentModal = modalTogglers.deleteSegment;
    const toggleEditSegmentModal = modalTogglers.editSegment;

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
              {...(
                name === 'generalTimeEntry' ?
                { toggleDeleteSegmentModal, toggleEditSegmentModal, windowWidth } :
                { segmentToDelete, segmentToEdit }
              )}
              closeModal={() => toggle(false)}
            />
          )
        )}
      </>
    );
  };
}

export default TimePage;