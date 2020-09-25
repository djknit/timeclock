import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { convertStringToNonbreakingHtml } from './utilities';
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
    const {
      job, parentPath, match, catchApiUnauthorized, areAnyModalsOpen, jobSettingsPageSubpaths
    } = this.props;
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

    function getRouteInfoObj(pageName, settingPropName, PageComp) {
      const _subpath = jobSettingsPageSubpaths[settingPropName || 'all'];
      const routePath = `${thisPath}/${_subpath}`;
      return {
        path: routePath,
        crumbChain: [
          ...crumbChain,
          {
            text: convertStringToNonbreakingHtml(pageName),
            url: routePath,
            stringText: pageName
          }
        ],
        settingPropName,
        pageName,
        PageComp
      };
    }

    const childRoutes = [
      getRouteInfoObj('Day Cutoff', 'dayCutoff'),
      getRouteInfoObj('Week Cutoff', 'weekBegins'),
      getRouteInfoObj('Timezone', 'timezone'),
      getRouteInfoObj('Wage', 'wage'),
      getRouteInfoObj('All Settings', undefined, All)
    ];

    const commonRouteAttrs = { ...this.props, job, catchApiUnauthorized, areAnyModalsOpen };

    return (
      <>
        <Switch>
          {childRoutes.map(
            RouteInfo => (
              <Route
                path={RouteInfo.path}
                render={props => (
                  <>
                    <PageTitle crumbChain={RouteInfo.crumbChain} {...{ areAnyModalsOpen }}/>
                    {RouteInfo.settingPropName ? (
                      <Setting
                        {...commonRouteAttrs}
                        settingName={RouteInfo.settingPropName}
                        settingDisplayName={RouteInfo.pageName}
                      />
                    ) : (
                      <RouteInfo.PageComp
                        {...commonRouteAttrs}
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
                <PageTitle {...{ crumbChain, areAnyModalsOpen }} />
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