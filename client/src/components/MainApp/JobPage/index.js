import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { currentJobService } from '../../../data';
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
    this.toggleEditJobNameModal = this.toggleEditJobNameModal.bind(this);
    this.toggleDeleteJobModal = this.toggleDeleteJobModal.bind(this);
    this.afterToggleCbFactory = this.afterToggleCbFactory.bind(this);
    this.setWaitingForDataState = this.setWaitingForDataState.bind(this);
    this.editJobNameInputRef = React.createRef();
    this.deleteJobModalInputRef = React.createRef();
    this.state = {
      isLoading: false,
      hasProblem: false,
      problemMessages: [],
      isEditJobNameModalActive: false,
      isDeleteJobModalActive: false
    };
  };

  toggleEditJobNameModal(isActiveAfterToggle) {
    this.setState(
      { isEditJobNameModalActive: !!isActiveAfterToggle },
      this.afterToggleCbFactory(isActiveAfterToggle, this.editJobNameInputRef)
    );
  };

  toggleDeleteJobModal(isActiveAfterToggle) {
    this.setState(
      { isDeleteJobModalActive: !!isActiveAfterToggle },
      this.afterToggleCbFactory(isActiveAfterToggle, this.deleteJobModalInputRef)
    );
  };

  afterToggleCbFactory(isActiveAfterToggle, inputRef) {
    return (() => {
      if (isActiveAfterToggle) inputRef.current.focus();
      const hasModalOpen = this.state.isEditJobNameModalActive;
      if (hasModalOpen !== this.props.areAnyModalsOpen) this.props.setAreAnyModalsOpen(hasModalOpen);
    });
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
  };

  render() {
    const {
      toggleEditJobNameModal, toggleDeleteJobModal, editJobNameInputRef, deleteJobModalInputRef
    } = this;
    const { job, match, returnToDashboard, history, catchApiUnauthorized } = this.props;
    const {
      isLoading, problemMessages, isEditJobNameModalActive, isDeleteJobModalActive
    } = this.state;
    
    const style = getStyle();

    const buildPath = subpath => `${match.url}/${subpath}`;
    const jobDashPath = buildPath('');
    const jobSettingsPath = buildPath('settings');
    const timePagePath = buildPath('time');
    const redirectorFactory = path => {
      return () => history.push(path);
    };
    const goToJobDash = redirectorFactory(jobDashPath);
    const goToJobSettings = redirectorFactory(jobSettingsPath);
    const goToTimePage = redirectorFactory(timePagePath);

    const commonRouteAttributes = {
      job,
      parentPath: match.url
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
                    ...commonRouteAttributes
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
                    returnToDashboard,
                    goToJobSettings,
                    goToTimePage,
                    toggleEditJobNameModal,
                    toggleDeleteJobModal
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

const JobPage = addData(_JobPage_needsData, 'job', currentJobService);

export default JobPage;

function getMessagesFromErr(err) {
  return (
    (err && err.response && err.response.data && err.response.data.messages) ||
    (err && err.messages) ||
    (err && err.message && [err.message]) ||
    ['An unknown problem was encountered.']
  );
}