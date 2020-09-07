import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { currentJobService, areModalsOpenService, windowWidthService } from '../../../data';
import { api } from '../utilities'
import getStyle from './style';
import ContentArea from '../ContentArea';
import PageTitle from '../PageTitle';
import Notification, { NotificationText } from '../../Notification';
import { ProgressBar } from '../../formPieces';
import JobDash from './JobDash';
import SettingsPage from './SettingsPage';
import TimePage from './TimePage';
import NotFound from '../../NotFound';
import EditJobNameModal from './EditJobNameModal';
import DeleteJobModal from './DeleteJobModal';
import { addData } from '../../higherOrder';

class _JobPage_needsData extends Component {
  constructor(props) {
    super(props);
    this.editJobNameInputRef = React.createRef();
    this.deleteJobModalInputRef = React.createRef();
    this.modalToggleFactory = this.modalToggleFactory.bind(this);
    this.toggleEditJobNameModal = (
      this.modalToggleFactory('isEditJobNameModalActive', this.editJobNameInputRef).bind(this)
    );
    this.toggleDeleteJobModal = (
      this.modalToggleFactory('isDeleteJobModalActive', this.deleteJobModalInputRef).bind(this)
    );
    this.setWaitingForDataState = this.setWaitingForDataState.bind(this);
    this.state = {
      isLoading: false,
      hasProblem: false,
      problemMessages: [],
      isEditJobNameModalActive: false,
      isDeleteJobModalActive: false,
      modalsRegistrationId: undefined
    };
  };

  modalToggleFactory(modalIsActivePropName, inputRef) {
    return function(isActiveAfterToggle) {
      this.setState(
        { [modalIsActivePropName]: !!isActiveAfterToggle },
        () => {
          if (isActiveAfterToggle) inputRef.current.focus();
          const {
            isDeleteJobModalActive, isEditJobNameModalActive, modalsRegistrationId
          } = this.state;
          const hasModalOpen = isDeleteJobModalActive || isEditJobNameModalActive;
          areModalsOpenService.report(modalsRegistrationId, hasModalOpen);
        }
      );
    };
  };

  setWaitingForDataState() {
    return new Promise(resolve => {
      this.setState({ isLoading: true }, resolve);
    });
  };

  componentDidMount() {
    const { job, match } = this.props;
    const { jobId } = match.params;
    if (!job || job._id !== jobId) {
      this.setWaitingForDataState()
      .then(() => api.jobs.get(jobId))
      .then(res => {
        if (!res || !res.data) throw new Error('Failed to retrieve data for job.');
        currentJobService.setCurrentJob(res.data);
      })
      .catch(err => {
        if (this.props.catchApiUnauthorized(err)) return;
        this.setState({
          isLoading: false,
          hasProblem: true,
          problemMessages: getMessagesFromErr(err)
        });
      });
    }
    this.setState({
      modalsRegistrationId: areModalsOpenService.getId()
    });
  };

  componentWillUnmount() {
    areModalsOpenService.report(this.state.modalsRegistrationId, false);
  };

  render() {
    const {
      toggleEditJobNameModal, toggleDeleteJobModal, editJobNameInputRef, deleteJobModalInputRef
    } = this;
    const {
      job, match, returnToDashboard, areAnyModalsOpen, catchApiUnauthorized, dashboardPath, windowWidth
    } = this.props;
    const {
      isLoading, problemMessages, isEditJobNameModalActive, isDeleteJobModalActive
    } = this.state;
    
    const style = getStyle();

    const buildPath = subpath => `${match.url}/${subpath}`;
    const jobDashPath = buildPath('');
    const jobSettingsPath = buildPath('settings');
    const timePagePath = buildPath('time');
    const buildSettingsSubPath = subPath => {
      return `${jobSettingsPath}/${subPath}`;
    };

    const commonRouteAttributes = {
      job,
      parentPath: match.url,
      catchApiUnauthorized,
      areAnyModalsOpen
    };

    return (
      job ? (
        <>
          <Switch>
            <Route
              path={jobSettingsPath}
              render={props => (
                <SettingsPage
                  {...{
                    ...props,
                    ...commonRouteAttributes
                  }}
                />
              )}
            />
            <Route
              path={timePagePath}
              render={props => (
                <TimePage
                  {...{
                    ...props,
                    ...commonRouteAttributes,
                    windowWidth
                  }}
                />
              )}
            />,
            <Route
              exact
              path={jobDashPath}
              render={props => (
                <JobDash
                  {...{
                    ...props,
                    ...commonRouteAttributes,
                    toggleEditJobNameModal,
                    toggleDeleteJobModal,
                    buildSettingsSubPath,
                    jobSettingsPath,
                    timePagePath,
                    dashboardPath,
                    windowWidth
                  }}
                />
              )}
            />
            <Route component={NotFound} />
          </Switch>
          <EditJobNameModal
            isActive={isEditJobNameModalActive}
            {...{
              job,
              catchApiUnauthorized
            }}
            inputRef={editJobNameInputRef}
            closeModal={() => toggleEditJobNameModal(false)}
          />
          <DeleteJobModal
            isActive={isDeleteJobModalActive}
            {...{
              job,
              catchApiUnauthorized,
              returnToDashboard
            }}
            inputRef={deleteJobModalInputRef}
            closeModal={() => toggleDeleteJobModal(false)}
          />
        </>
      ) : (
        <>
          <PageTitle>JOB</PageTitle>
          <ContentArea style={style.noDataContentArea}>
            { 
              isLoading ? (
                <Notification theme="info">
                  <NotificationText>Retrieving data...</NotificationText>
                  <ProgressBar
                    theme="primary"
                    max={100}
                  />
                </Notification>
              ) : (
                <Notification theme="danger">
                  <NotificationText>Oops! Your job data failed to load.</NotificationText>
                  <NotificationText>
                    Try going back to a previous page and then loading this page again.
                    You may also try logging out and logging back in.
                  </NotificationText>
                  <hr />
                  <NotificationText>Error(s):</NotificationText>
                  {problemMessages.map(
                    (msg, index) => (
                      <NotificationText isLast={index === problemMessages.length - 1}>
                        {msg}
                      </NotificationText>
                    )
                  )}
                </Notification>
              )
            }
          </ContentArea>
        </>
      )
    );
  };
}

const _JobPage_stillNeedsData = addData(_JobPage_needsData, 'job', currentJobService);
const JobPage = addData(_JobPage_stillNeedsData, 'windowWidth', windowWidthService);

export default JobPage;

function getMessagesFromErr(err) {
  return (
    (err && err.response && err.response.data && err.response.data.messages) ||
    (err && err.messages) ||
    (err && err.message && [err.message]) ||
    ['An unknown problem was encountered.']
  );
}