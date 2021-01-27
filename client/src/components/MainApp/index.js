import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { userService } from '../../data';
import { api, modalManagement } from './utilities';
import getStyle from './style';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import JobPage from './JobPage';
import NotFoundPage from '../NotFound';
import NewJobModal from './NewJobModal';
import EditAccountModal from './EditAccountModal';
import DeleteAccountPropModal from './DeleteAccountPropModal';

const {
  createModalInfo, addModalsStateAndMethods, reportModalsClosedFor, extractModalsResources
} = modalManagement;

const modalsInfo = [
  createModalInfo('newJob', NewJobModal, true),
  createModalInfo('editAccount', EditAccountModal, true, 'accountPropToEditName'),
  createModalInfo('deleteAccountProp', DeleteAccountPropModal, true, 'accountPropToEditName')
];

const dashboardPathName = 'dashboard';

class MainApp extends Component {
  constructor(props) {
    super(props);
    this.setNavHeight = this.setNavHeight.bind(this);
    this.catchApiUnauthorized = this.catchApiUnauthorized.bind(this);
    let state = {};
    addModalsStateAndMethods(this, state, modalsInfo);
    this.state = {
      ...state,
      navHeight: undefined,
      accountPropToEditName: undefined
    };
  };

  setNavHeight(navHeight) {
    this.setState({ navHeight });
  };

  catchApiUnauthorized(err) {
    if (err && err.response && err.response.status === 401) {
      userService.clearValue();
      this.props.history.push('/');
      return true;
    }
    return false;
  };
  
  componentDidMount() {
    api.auth.test()
    .then(res => {
      const { match, history } = this.props
      if (!userService.getValue() && res.data.user) {
        userService.setValue(res.data.user);
      }
      if (match.isExact) {
        history.push(`${match.path}/${dashboardPathName}`);
      }
    })
    .catch(() => {
      userService.clearValue();
      this.props.history.push('/');
    });
  };

  componentWillUnmount() {
    reportModalsClosedFor(this);
  };

  render() {
    const { setNavHeight, catchApiUnauthorized } = this;
    const {
      history,
      match,
      areAnyModalsOpen,
    } = this.props;
    const { navHeight, accountPropToEditName } = this.state;

    const { modalTogglers, modals } = extractModalsResources(this, modalsInfo);

    const toggleEditAccountModal = modalTogglers.editAccount;
    const toggleDeleteAccountPropModal = modalTogglers.deleteAccountProp;
    const toggleNewJobModal = modalTogglers.newJob;

    const style = getStyle(navHeight);

    const buildPath = subpath => `${match.path}/${subpath}`;

    const goTo = path => history.push(path);
    const getJobPagePath = jobId => buildPath(`job/${jobId}`);
    const redirectToJobPage = jobId => goTo(getJobPagePath(jobId));
    const returnToDashboard = () => goTo(match.path);

    const jobPageSubpaths = {
      timePage: 'time',
      settingsPage: 'settings'
    };
    const jobSettingsPageSubpaths = {
      dayCutoff: 'day-cutoff',
      weekBegins: 'week-begins',
      timezone: 'timezone',
      wage: 'wage',
      all: 'all'
    };

    const openNewJobModal = () => toggleNewJobModal(true);
    const accountEditingModalOpenerFactory = propToEditName => {
      return (() => toggleEditAccountModal(true, propToEditName));
    };
    const accountPropDeletingModalOpenerFactory = propToDeleteName => {
      return (() => toggleDeleteAccountPropModal(true, propToDeleteName));
    };

    const renderDashboard = props => (
      <Dashboard
        {...{
          ...props,
          redirectToJobPage,
          openNewJobModal,
          catchApiUnauthorized,
          accountEditingModalOpenerFactory,
          accountPropDeletingModalOpenerFactory,
          areAnyModalsOpen,
          getJobPagePath
        }}
      />
    );

    const dashboardPath = buildPath(dashboardPathName);

    return (
      <>
        <Navbar
          history={history}
          totalHeight={navHeight}
          reportHeight={setNavHeight}
          {...{
            catchApiUnauthorized,
            areAnyModalsOpen,
            dashboardPath,
            getJobPagePath,
            openNewJobModal,
            jobPageSubpaths,
            jobSettingsPageSubpaths,
            goTo
          }}
        />
        <div style={style.mainContentArea}>
          <Switch>
            <Route
              path={dashboardPath}
              render={renderDashboard}
            />
            {/* '/app' is redirected to '/app/dashboard' in componentDidMount. Next route prevents glitchy looking effect of rendering the 404 page momentarily before redirecting to '/app/dashboard'. */}
            <Route
              exact
              path={buildPath('')}
              render={renderDashboard}
            />
            <Route
              path={getJobPagePath(':jobId')}
              render={props => (
                <JobPage
                  {...{
                    ...props,
                    catchApiUnauthorized,
                    areAnyModalsOpen,
                    returnToDashboard,
                    dashboardPath,
                    jobPageSubpaths,
                    jobSettingsPageSubpaths
                  }}
                />
              )}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
        {modals.map(
          ({ ModalComponent, toggle, inputRef, isActive, name }) => (
            <ModalComponent
              key={name}
              {...{
                isActive,
                inputRef,
                catchApiUnauthorized,
                ...(
                  (name === 'newJob' && { redirectToJobPage }) ||
                  (name === 'editAccount' && { propToEditName: accountPropToEditName }) ||
                  { propToDeleteName: accountPropToEditName }
                )
              }}
              closeModal={() => toggle(false)}
            />
          )
        )}
      </>
    );
  };
}

export default MainApp;
