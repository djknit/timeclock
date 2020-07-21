import React, { Component } from 'react';
import getStyle from './style';
import { windowWidthService } from '../../../../data';
import PageTitle from '../../PageTitle';
import Button from '../../../Button';
import ContentArea, { ContentAreaTitle } from '../../ContentArea';
import QuickNav from './QuickNav';
import Basics from './Basics';
import Settings from './Settings';
import { addHeightTracking } from '../../../higherOrder';

class _JobDash_needsHeightTracking extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    const { state, props } = this;
    const {
      job, returnToDashboard, areAnyModalsOpen, goToJobSettings, goToTimePage, toggleEditJobNameModal, toggleDeleteJobModal, heightTracking
    } = props;

    const style = getStyle(heightTracking.maxHeight);

    return (
      <>
        <PageTitle>JOB:&nbsp;{job.name}</PageTitle>
        <QuickNav
          {...{
            returnToDashboard,
            goToJobSettings,
            goToTimePage
          }}
          disabled={areAnyModalsOpen}
          style={style.quickNav}
        />
        <div style={style.contentAreasRow}>
          <Basics
            areaRef={heightTracking.ref1}
            disabled={areAnyModalsOpen}
            style={style.basics}
            {...{
              toggleEditJobNameModal,
              job,
              toggleDeleteJobModal
            }}
          />
          <Settings
            areaRef={heightTracking.ref2}
            disabled={areAnyModalsOpen}
            style={style.menu}
            {...{
              job
            }}
          />
        </div>
      </>
    );
  };
}

const JobDash = addHeightTracking(_JobDash_needsHeightTracking);

export default JobDash;