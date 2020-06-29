import React, { Component } from 'react';
import getStyle from './style';
import { windowWidthService } from '../../../data'
import ContentArea, { ContentAreaTitle } from  '../ContentArea';
import PageTitleArea from '../PageTitleArea';
import Jobs from './Jobs';
import Account from './Account';
import { addData } from '../../higherOrder';

class _Dashboard_needsData extends Component {
  constructor(props) {
    super(props);
  };

  render() {

    const style = getStyle(this.props.windowWidth);
    const {
      redirectToJobPage,
      openNewJobModal,
      catchApiUnauthorized,
      accountEditingModalOpenerFactory,
      accountPropDeletingModalOpenerFactory,
      areAnyModalsOpen
    } = this.props;

    return (
      <>
        <PageTitleArea title="DASHBOARD" />
        <div style={style.contentAreasRow}>
          <Account
            style={style.account}
            {...{
              accountEditingModalOpenerFactory,
              accountPropDeletingModalOpenerFactory,
              areAnyModalsOpen
            }}
          />
          <Jobs
            style={style.jobs}
            {...{
              redirectToJobPage,
              openNewJobModal,
              catchApiUnauthorized,
              areAnyModalsOpen
            }}
          />
        </div>
      </>
    );
  };
}

const Dashboard = addData(_Dashboard_needsData, 'windowWidth', windowWidthService);

export default Dashboard;