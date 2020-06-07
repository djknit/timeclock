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

const dashboardPathName = 'dashboard';

class MainApp extends Component {
  constructor(props) {
    super(props);
    this.setNavHeight = this.setNavHeight.bind(this);
    this.toggleNewJobModal = this.toggleNewJobModal.bind(this);
    this.focusNewJobModal = this.focusNewJobModal.bind(this);
    this.catchApiUnauthorized = this.catchApiUnauthorized.bind(this);
    this.newJobInputRef = React.createRef();
    this.state = {
      navHeight: undefined,
      isNewJobModalActive: false
    };
  };

  setNavHeight(navHeight) {
    this.setState({ navHeight });
  };

  toggleNewJobModal(isActiveAfterToggle) {
    if (isActiveAfterToggle) {
      this.setState({ isNewJobModalActive: true }, this.focusNewJobModal);
    }
    else {
      this.setState({ isNewJobModalActive: false });
    }
  };

  focusNewJobModal() {
    this.newJobInputRef.current.focus();
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
        history.push(`${match.path}/${dashboardPathName}`)
      }
    })
    .catch(() => {
      userService.clearUser();
      this.props.history.push('/');
    });
  }

  render() {
    const {
      props, state, toggleNewJobModal, newJobInputRef, catchApiUnauthorized
    } = this;
    const {
      history, match
    } = props;
    const {
      navHeight, isNewJobModalActive
    } = state;

    const style = getStyle(navHeight);

    const buildPath = subpath => `${match.path}/${subpath}`;

    const redirectToJobPage = jobId => history.push(buildPath(`job/${jobId}`));

    const openNewJobModal = () => toggleNewJobModal(true);

    const renderDashboard = props => (
      <Dashboard {...{ ...props, redirectToJobPage, openNewJobModal, catchApiUnauthorized }} />
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
      </>
    );
  };
}

export default MainApp;