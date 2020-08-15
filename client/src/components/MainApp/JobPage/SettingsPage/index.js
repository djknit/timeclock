import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PageTitle from '../../PageTitle';
import Landing from './Landing';
import Setting from './Setting';
import All from './All';

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    const { job, parentPath, match, catchApiUnauthorized } = this.props;
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

    function getRouteInfoObj(pathName, pageName, settingPropName, PageComp) {
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
        settingPropName,
        pageName,
        PageComp
      };
    }

    const childRoutes = [
      getRouteInfoObj('day-cutoff', 'Day Cutoff', 'dayCutoff'),
      getRouteInfoObj('week-begins', 'Week Cutoff', 'weekBegins'),
      getRouteInfoObj('timezone', 'Timezone', 'timezone'),
      getRouteInfoObj('wage', 'Wage', 'wage'),
      getRouteInfoObj('all', 'All Settings', undefined, All)
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
                    {RouteInfo.settingPropName ? (
                      <Setting
                        {...{
                          ...props,
                          job,
                          catchApiUnauthorized
                        }}
                        settingName={RouteInfo.settingPropName}
                        settingDisplayName={RouteInfo.pageName}
                      />
                    ) : (
                      <RouteInfo.PageComp
                        {...{
                          ...props,
                          job,
                          catchApiUnauthorized
                        }}
                      />
                    )}
                  </>
                )}
                key={RouteInfo.path}
              />
            )
          )}
          <Route
            path={thisPath}
            render={props => (
              <>
                <PageTitle {...{ crumbChain }} />
                <Landing
                  {...{
                    childRoutes,
                    ...props
                  }}
                />
              </>
            )}
          />
        </Switch>
      </>
    );
  };
}

export default SettingsPage;