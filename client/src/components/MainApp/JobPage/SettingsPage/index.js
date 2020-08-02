import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PageTitle from '../../PageTitle';
import Landing from './Landing';
import WeekBegins from './WeekBegins';
import DayCutoff from './DayCutoff';
import Timezone from './Timezone';
import Wage from './Wage';
import All from './All';

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    const { job, parentPath, match, redirectorFactory } = this.props;
    const thisPath = match.url;

    const crumbChain = [
      {
        text: <>JOB:&nbsp;{job.name}</>,
        url: parentPath
      },
      {
        text: 'Settings',
        url: thisPath
      }
    ];

    function getRouteInfoObj(pathName, pageName, PageComp) {
      const routePath = `${thisPath}/${pathName}`;
      return {
        path: routePath,
        crumbChain: [
          ...crumbChain,
          {
            text: pageName,
            url: routePath
          }
        ],
        PageComp,
        pageName,
        redirector: redirectorFactory(routePath)
      };
    }
    const childRoutes = [
      getRouteInfoObj('day-cutoff', 'Day Cutoff', DayCutoff),
      getRouteInfoObj('week-begins', 'Week Cutoff', WeekBegins),
      getRouteInfoObj('timezone', 'Timezone', Timezone),
      getRouteInfoObj('wage', 'Wage', Wage),
      getRouteInfoObj('all', 'All Settings', All)
    ];

    return (
      <>
        <Switch>
          {childRoutes.map(
            RouteInfo => (
              <Route
                path={RouteInfo.path}
                render={props => (
                  <>
                    <PageTitle crumbChain={RouteInfo.crumbChain} />
                    <RouteInfo.PageComp {...props} />
                  </>
                )}
              />
            )
          )}
          <Route
            path={thisPath}
            render={props => (
              <>
                <PageTitle {...{ crumbChain }} />
                <Landing {...{ childRoutes, ...props }} />
              </>
            )}
          />
        </Switch>
      </>
    );
  };
}

export default SettingsPage;