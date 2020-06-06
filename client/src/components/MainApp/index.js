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
// import { addData } from '../higherOrder';

const dashboardPathName = 'dashboard';

class MainApp extends Component {
  constructor(props) {
    super(props);
    this.setNavHeight = this.setNavHeight.bind(this);
    this.toggleNewJobModal = this.toggleNewJobModal.bind(this);
    this.focusNewJobModal = this.focusNewJobModal.bind(this);
    this.setWageContentHeight = this.setWageContentHeight.bind(this);
    this.toggleNewJobModalWageContent = this.toggleNewJobModalWageContent.bind(this);
    this.catchApiUnauthorized = this.catchApiUnauthorized.bind(this);
    this.newJobInputRef = React.createRef();
    this.newJobModalWageContentRef = React.createRef();
    this.state = {
      navHeight: undefined,
      isNewJobModalActive: false,
      newJobModalWageContentHeight: undefined,
      newJobModalIsWageContentExpanded: false,
      isWageContentAnimationOn: false
    };
  };

  setNavHeight(navHeight) {
    this.setState({ navHeight });
  };

  toggleNewJobModal(isActiveAfterToggle) {
    if (isActiveAfterToggle) {
      this.setState(
        { isNewJobModalActive: isActiveAfterToggle },
        () => {
          this.focusNewJobModal();
          this.setWageContentHeight();
        }
      );
    }
    else {
      this.setState({
        isNewJobModalActive: isActiveAfterToggle,
        newJobModalWageContentHeight: undefined,
        isWageContentAnimationOn: false
      });
    }
  };

  focusNewJobModal() {
    this.newJobInputRef.current.focus();
  };

  setWageContentHeight() {
    this.setState({
      newJobModalWageContentHeight: this.newJobModalWageContentRef.current.scrollHeight,
      newJobModalIsWageContentExpanded: !!this.state.newJobModalIsWageContentExpanded // set to false if currently undefined
    }, () => {console.log('setWageContentHeight');console.log(this.state)});
  };

  toggleNewJobModalWageContent(newIsExpandedValue) {
    console.log('toggleNewJobModalWageContent')
    const wasNewValueProvided = !!newIsExpandedValue || newIsExpandedValue === false;
    this.setState({ // use parameter if provided or toggle opposite current value when no value is provided
      newJobModalIsWageContentExpanded: (
        wasNewValueProvided ?
        newIsExpandedValue :
        !this.state.newJobModalIsWageContentExpanded
      ),
      isWageContentAnimationOn: true
    }, () => console.log(this.state));
  };

  catchApiUnauthorized(err) {
    console.log('CATCH API 401')
    if (err && err.response && err.response.status === 401) {
      userService.clearUser();
      this.props.history.push('/');
      return true;
    }
    return false;
  }

  componentDidMount() {
    console.log(this.newJobInputRef)
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
      props, state, toggleNewJobModal, newJobInputRef, catchApiUnauthorized, newJobModalWageContentRef, toggleNewJobModalWageContent
    } = this;
    const {
      history, match
    } = props;
    const {
      navHeight, isNewJobModalActive, newJobModalIsWageContentExpanded, newJobModalWageContentHeight, isWageContentAnimationOn
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
            catchApiUnauthorized,
            isWageContentAnimationOn
          }}
          wageSectionContentRef={newJobModalWageContentRef}
          wageSectionContentHeight={newJobModalWageContentHeight}
          isWageSectionExpanded={newJobModalIsWageContentExpanded}
          toggleWageContent={toggleNewJobModalWageContent}
        />
      </>
    );
  };
}

export default MainApp;