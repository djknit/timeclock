import React, { Component } from 'react';
import getStyle from './style';
import PageTitle from '../../PageTitle';
import QuickNav from './QuickNav';
import Basics from './Basics';
import Settings from './Settings';

class JobDash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    const {
      job,
      areAnyModalsOpen,
      toggleEditJobNameModal,
      toggleDeleteJobModal,
      windowWidth,
      buildSettingsSubPath,
      jobSettingsPath,
      timePagePath,
      dashboardPath,
      jobSettingsPageSubpaths
    } = this.props;

    const style = getStyle(windowWidth);

    return (
      <>
        <PageTitle>JOB:&nbsp;{job.name}</PageTitle>
        <QuickNav
          {...{
            jobSettingsPath,
            timePagePath,
            dashboardPath,
            windowWidth
          }}
          disabled={areAnyModalsOpen}
          style={style.quickNav}
        />
        <div style={style.contentAreasRow}>
          <Basics
            disabled={areAnyModalsOpen}
            style={style.basics}
            {...{
              toggleEditJobNameModal,
              job,
              toggleDeleteJobModal
            }}
          />
          <Settings
            disabled={areAnyModalsOpen}
            style={style.settings}
            settings={job.settings}
            {...{
              buildSettingsSubPath,
              jobSettingsPageSubpaths
            }}
          />
        </div>
      </>
    );
  };
}

export default JobDash;
