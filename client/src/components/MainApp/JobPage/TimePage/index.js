import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { modalManagement } from './utilities';
import GeneralEntryModal from './GeneralEntryModal';
import DeleteSegmentModal from './DeleteSegmentModal';
import EditSegmentModal from './EditSegmentModal';
import RecentlyAddedModal from './RecentlyAddedModal';
import SessionTimezoneModal from './SessionTimezoneModal';
import Landing from './Landing';

const {
  addModalsStateAndMethods, reportModalsClosedFor, extractModalsResources, createModalInfo
} = modalManagement;

const modalsInfo = [
  createModalInfo('generalTimeEntry', GeneralEntryModal, false),
  createModalInfo('recentlyAdded', RecentlyAddedModal, false),
  createModalInfo('deleteSegment', DeleteSegmentModal, false, 'segmentToDelete'),
  createModalInfo(
    'editSegment', EditSegmentModal, false, 'segmentToEdit', undefined, 'handleEditSegSuccess'
  ),
  createModalInfo('sessionTimezone', SessionTimezoneModal, false)
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

  stateSetterFactory(propName) {
    return function (newValue) {
      return new Promise(resolve => {
        this.setState({ [propName]: newValue }, resolve);
      });
    };
  };
  
  componentWillUnmount() {
    reportModalsClosedFor(this);
  };

  render() {
    const { setSegmentToDelete, setSegmentToEdit } = this;
    const { job, parentPath, windowWidth, areAnyModalsOpen, match } = this.props;
    const {
      segmentToDelete,
      segmentToEdit,
      handleEditSegSuccess,
      isEditSegmentModalActive,
      isDeleteSegmentModalActive,
      isSessionTimezoneModalActive
    } = this.state;

    const thisPath = match.url;
    const { modals, modalTogglers } = extractModalsResources(this, modalsInfo);

    const toggleGeneralEntryModal = modalTogglers.generalTimeEntry;
    const toggleDeleteSegmentModal = modalTogglers.deleteSegment;
    const toggleEditSegmentModal = modalTogglers.editSegment;
    const toggleRecentlyAddedModal = modalTogglers.recentlyAdded;
    const toggleSessionTimezoneModal = modalTogglers.sessionTimezone;
    
    const primaryModalAttrs = { // for the modals that can open other modals on top
      toggleDeleteSegmentModal,
      toggleEditSegmentModal,
      toggleSessionTimezoneModal,
      disabled: isEditSegmentModalActive || isDeleteSegmentModalActive || isSessionTimezoneModalActive
    };
    const variableModalAttrs = {
      generalTimeEntry: { ...primaryModalAttrs, windowWidth },
      deleteSegment: { segmentToDelete, setSegmentToDelete },
      editSegment: {
        segmentToEdit,
        setSegmentToEdit,
        reportUpdate: handleEditSegSuccess
      },
      recentlyAdded: { ...primaryModalAttrs },
      // sessionTimezone: {}
    };

    const crumbChain = [
      {
        text: <>JOB:&nbsp;{job.name}</>,
        url: parentPath,
        stringText: `JOB: ${job.name}`
      },
      {
        text: 'Time',
        url: thisPath
      }
    ];

    return (
      <>
        <Switch>
          <Route
            path={thisPath}
            render={props => (
              <Landing
                {...props}
                {...{
                  crumbChain,
                  windowWidth,
                  job,
                  areAnyModalsOpen,
                  toggleGeneralEntryModal,
                  toggleDeleteSegmentModal,
                  toggleRecentlyAddedModal,
                  toggleSessionTimezoneModal
                }}
              />
            )}
          />
        </Switch>
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