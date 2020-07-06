import React, { Component } from 'react';
import getStyle from './style';
import { windowWidthService } from '../../../../data';
import PageTitle from '../../PageTitle';
import Button from '../../../Button';
import ContentArea, { ContentAreaTitle } from '../../ContentArea';
import QuickNav from './QuickNav';
import Basics from './Basics';
import Settings from './Settings';

class JobDash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    const { state, props } = this;
    const {
      job, match, history, returnToDashboard, areAnyModalsOpen
    } = props;
    const { quickNavButtonHeight } = state;
    console.log(match) 
    console.log(history)

    const style = getStyle(quickNavButtonHeight);

    

    return (
      <>
        <PageTitle>JOB:&nbsp;{job.name}</PageTitle>
        <QuickNav
          {...{ returnToDashboard }}
          disabled={areAnyModalsOpen}
          style={style.quickNav}
        />
        <div style={style.contentAreasRow}>
          <Basics
            disabled={areAnyModalsOpen}
            style={style.basics}
          />
          <Settings
            disabled={areAnyModalsOpen}
            style={style.menu}
          />
        </div>
      </>
    );
  };
}

export default JobDash;