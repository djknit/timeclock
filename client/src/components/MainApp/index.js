import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { userService } from '../../data';
import { api } from './utilities';
import getStyle from './style';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import JobPage from './JobPage';
import NotFoundPage from '../NotFound';
import NewJobModal from './NewJobModal';
import EditAccountModal from './EditAccountModal';
import DeleteAccountPropModal from './DeleteAccountPropModal';

const dashboardPathName = 'dashboard';

class MainApp extends Component {
  constructor(props) {
    super(props);
    this.setNavHeight = this.setNavHeight.bind(this);
    this.modalToggleFactory = this.modalToggleFactory.bind(this);
    this.catchApiUnauthorized = this.catchApiUnauthorized.bind(this);
    this.newJobInputRef = React.createRef();
    this.deletingAccountPropInputRef = React.createRef();
    this.editingAccountPropInputRef = React.createRef();
    this.toggleNewJobModal = this.modalToggleFactory('isNewJobModalActive', this.newJobInputRef).bind(this);
    this.toggleEditAccountModal = this
      .modalToggleFactory('isEditAccountModalActive', this.editingAccountPropInputRef, true)
      .bind(this);
    this.toggleDeleteAccountPropModal = this
      .modalToggleFactory('isDeleteAccountPropModalActive', this.deletingAccountPropInputRef, true)
      .bind(this);
    this.state = {
      navHeight: undefined,
      isNewJobModalActive: false,
      isEditAccountModalActive: false,
      isDeleteAccountPropModalActive: false,
      accountPropToEditName: undefined
    };
  };

  setNavHeight(navHeight) {
    this.setState({ navHeight });
  };

  modalToggleFactory(modalIsActivePropName, inputRef, usesAccountEdit) {
    return function(isActiveAfterToggle, propToEditName) {
      let stateUpdates = { [modalIsActivePropName]: !!isActiveAfterToggle };
      if (usesAccountEdit) stateUpdates.accountPropToEditName = propToEditName;
      this.setState(
        stateUpdates,
        () => isActiveAfterToggle ? inputRef.current.focus() : undefined
      );
    };
  };

  catchApiUnauthorized(err) {
    if (err && err.response && err.response.status === 401) {
      userService.clearUser();
      this.props.history.push('/');
      return true;
    }
    return false;
  }

  componentDidMount() {
    api.auth.test()
    .then(res => {
      const { match, history } = this.props
      if (!userService.getValue() && res.data.user) {
        userService.setUser(res.data.user);
      }
      if (match.isExact) {
        history.push(`${match.path}/${dashboardPathName}`);
      }
    })
    .catch(() => {
      userService.clearUser();
      this.props.history.push('/');
    });
  }

  render() {
    const {
      state, toggleNewJobModal, newJobInputRef, catchApiUnauthorized, toggleEditAccountModal, toggleDeleteAccountPropModal, deletingAccountPropInputRef
    } = this;
    const { history, match } = this.props;
    const {
      navHeight, isNewJobModalActive, isEditAccountModalActive, accountPropToEditName, isDeleteAccountPropModalActive
    } = state;

    const style = getStyle(navHeight);

    const buildPath = subpath => `${match.path}/${subpath}`;

    const redirectToJobPage = jobId => history.push(buildPath(`job/${jobId}`));

    const openNewJobModal = () => toggleNewJobModal(true);
    const accountEditingModalOpenerFactory = propToEditName => {
      return () => toggleEditAccountModal(true, propToEditName);
    };
    const accountPropDeletingModalOpenerFactory = propToDeleteName => {
      return () => toggleDeleteAccountPropModal(true, propToDeleteName);
    };

    const renderDashboard = props => (
      <Dashboard
        {...{
          ...props,
          redirectToJobPage,
          openNewJobModal,
          catchApiUnauthorized,
          accountEditingModalOpenerFactory,
          accountPropDeletingModalOpenerFactory
        }}
      />
    );

    return (
      <>
        <Navbar
          history={history}
          totalHeight={navHeight}
          reportHeight={this.setNavHeight}
          {...{ catchApiUnauthorized }}
        />
        <div style={style.mainContentArea}>
          <Switch>
            <Route
              path={buildPath(dashboardPathName)}
              render={renderDashboard}
            />
            {/* '/app' is redirected to '/app/dashboard' in componentDidMount. Next route prevents glitchy looking effect of rendering the 404 page momentarily before redirecting to '/app/dashboard'. */}
            <Route
              exact
              path={buildPath('')}
              render={renderDashboard}
            />
            <Route
              path={buildPath('job/:jobId')}
              render={props => <JobPage {...{ ...props, catchApiUnauthorized }} />}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
        <NewJobModal
          isActive={isNewJobModalActive}
          closeModal={() => toggleNewJobModal(false)}
          redirectToJobPage={redirectToJobPage}
          inputRef={newJobInputRef}
          {...{
            catchApiUnauthorized
          }}
        />
        <EditAccountModal
          isActive={isEditAccountModalActive}
          closeModal={() => toggleEditAccountModal(false)}
          propToEditName={accountPropToEditName}
          inputRef={this.editingAccountPropInputRef}
          {...{
            catchApiUnauthorized
          }}
        />
        <DeleteAccountPropModal
          isActive={isDeleteAccountPropModalActive}
          closeModal={() => toggleDeleteAccountPropModal(false)}
          propToDeleteName={accountPropToEditName}
          inputRef={deletingAccountPropInputRef}
          {...{
            catchApiUnauthorized
          }}
        />
      </>
    );
  };
}

export default MainApp;