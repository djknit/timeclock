import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { currentJobService, windowWidthService } from '../../../data';
import { api, modalManagement } from '../utilities'
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

const {
  createModalInfo, addModalsStateAndMethods, extractModalsResources, reportModalsClosedFor
} = modalManagement;

const modalsInfo = [
  createModalInfo('editJobName', EditJobNameModal, true),
  createModalInfo('deleteJob', DeleteJobModal, true)
];

class _JobPage_needsData extends Component {
  constructor(props) {
    super(props);
    this.setWaitingForDataState = this.setWaitingForDataState.bind(this);
    let state = {};
    addModalsStateAndMethods(this, state, modalsInfo);
    this.state = {
      ...state,
      isLoading: false,
      hasProblem: false,
      problemMessages: []
    };
  };

  setWaitingForDataState() {
    return new Promise(resolve => {
      this.setState({ isLoading: true }, resolve);
    });
  };

  componentDidMount() {
    const { job, match, addPageNavMenu } = this.props;
    const { jobId } = match.params;
    if (!job || job._id !== jobId) {
      this.setWaitingForDataState()
      .then(() => api.jobs.get(jobId))
      .then(res => {
        if (!res || !res.data) throw new Error('Failed to retrieve data for job.');
        currentJobService.setValue(res.data);
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

  componentWillUnmount() {
    reportModalsClosedFor(this);
    currentJobService.clearValue();
  };

  render() {
    const {
      job,
      match,
      returnToDashboard,
      areAnyModalsOpen,
      catchApiUnauthorized,
      dashboardPath,
      windowWidth,
      jobPageSubpaths,
      jobSettingsPageSubpaths
    } = this.props;
    const { isLoading, problemMessages } = this.state;

    const { modals, modalTogglers } = extractModalsResources(this, modalsInfo);

    const toggleEditJobNameModal = modalTogglers.editJobName;
    const toggleDeleteJobModal = modalTogglers.deleteJob;
    
    const style = getStyle();

    const buildPath = subpath => `${match.url}/${subpath}`;
    const jobDashPath = buildPath('');
    const jobSettingsPath = buildPath(jobPageSubpaths.settingsPage);
    const timePagePath = buildPath(jobPageSubpaths.timePage);
    const buildSettingsSubPath = subPath => {
      return `${jobSettingsPath}/${subPath}`;
    };

    const commonRouteAttributes = {
      job,
      parentPath: match.url,
      catchApiUnauthorized,
      areAnyModalsOpen
    };

    console.log('job\n', job);

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
                    ...commonRouteAttributes,
                    jobSettingsPageSubpaths
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
                    windowWidth,
                    jobSettingsPageSubpaths
                  }}
                />
              )}
            />
            <Route component={NotFound} />
          </Switch>
          {modals.map(
            ({ ModalComponent, isActive, inputRef, toggle, name }) => (
              <ModalComponent
                key={name}
                {...{
                  isActive,
                  inputRef,
                  job,
                  catchApiUnauthorized
                }}
                {...(name === 'deleteJob' ? { returnToDashboard } : {})}
                closeModal={() => toggle(false)}
              />
            )
          )}
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
