import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PageTitle from '../../PageTitle';
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
    const { job, parentPath, match } = this.props;

    const crumbChain = [
      {
        text: <>JOB:&nbsp;{job.name}</>,
        url: parentPath
      },
      {
        text: 'Settings',
        url: match.url
      }
    ];

    function getRouteInfoObj(pathName, pageName, PageComp) {
      const routePath = `${match.url}/${pathName}`
      return {
        path: routePath,
        crumbChain: [
          ...crumbChain,
          {
            text: pageName,
            url: routePath
          }
        ],
        PageComp
      };
    }
    const childRoutes = [
      getRouteInfoObj('day-cutoff', 'Day Cutoff', DayCutoff),
      getRouteInfoObj('week-begins', 'Week Cutoff', WeekBegins),
      getRouteInfoObj('timezone', 'Timezone', Timezone)
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
        </Switch>
      </>
    );
  };
}

export default SettingsPage;