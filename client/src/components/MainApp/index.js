import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { userService } from '../../data';
import { api } from './utilities';
import getStyle from './style';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import JobPage from './JobPage';
import NotFoundPage from '../NotFound';
// import { addData } from '../higherOrder';

const dashboardPathName = 'dashboard';

class MainApp extends Component {
  constructor(props) {
    super(props);
    this.setNavHeight = this.setNavHeight.bind(this);
    this.state = {
      navHeight: undefined
    };
  };

  setNavHeight(navHeight) {
    this.setState({ navHeight });
  };

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
    const { history, match } = this.props;
    const { navHeight } = this.state;

    const style = getStyle(navHeight);

    const buildPath = subpath => `${match.path}/${subpath}`;

    return (
      <>
        <Navbar
          history={history}
          totalHeight={navHeight}
          reportHeight={this.setNavHeight}
        />
        <div style={style.mainContentArea}>
          <Switch>
            <Route
              path={buildPath(dashboardPathName)}
              render={props => <Dashboard {...props} />}
            />
            {/* '/app' is redirected to '/app/dashboard' in componentDidMount. Next route prevents glitchy looking effect of rendering the 404 page momentarily before redirecting to '/app/dashboard'. */}
            <Route
              exact
              path={buildPath('')}
              render={props => <Dashboard {...props} />}
            />
            <Route
              path={buildPath('job/:jobName')}
              render={props => <JobPage {...props} />}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </>
    );
  };
}

export default MainApp;