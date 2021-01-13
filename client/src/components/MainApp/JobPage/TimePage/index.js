import React, { Component } from 'react';
import getStyle from './style';
import { modalManagement, guessUserTimezone } from './utilities';
import PageTitle from '../../PageTitle';
import GeneralEntryModal from './GeneralEntryModal';
import DeleteSegmentModal from './DeleteSegmentModal';
import General from './General';
import Summary from './Summary';
import Weeks from './Weeks';

const {
  addModalsStateAndMethods, reportModalsClosedFor, extractModalsResources, createModalInfo
} = modalManagement;

const modalsInfo = [
  createModalInfo('generalTimeEntry', GeneralEntryModal, false, undefined, 'setFocus'),
  createModalInfo('deleteSegment', DeleteSegmentModal, false, 'segmentToDelete')
];

class TimePage extends Component {
  constructor(props) {
    super(props);
    let state = {};
    addModalsStateAndMethods(this, state, modalsInfo);
    this.state = {
      ...state,
      segmentToDelete: undefined
    };
  };

  componentWillUnmount() {
    reportModalsClosedFor(this);
  };

  render() {

    const { job, parentPath, windowWidth } = this.props;
    const { segmentToDelete } = this.state;

    const { modals, modalTogglers } = extractModalsResources(this, modalsInfo);

    const toggleGeneralEntryModal = modalTogglers.generalTimeEntry;
    const toggleDeleteSegmentModal = modalTogglers.deleteSegment;

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
                name === 'deleteSegment' ?
                { segmentToDelete } :
                { toggleDeleteSegmentModal, windowWidth }
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
