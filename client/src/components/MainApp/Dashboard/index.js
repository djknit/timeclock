import React, { Component } from 'react';
import getStyle from './style';
import { windowWidthService } from '../../../data'
import PageTitle from '../PageTitle';
import Jobs from './Jobs';
import Account from './Account';
import { addData } from '../../higherOrder';

class _Dashboard_needsData extends Component {
  constructor(props) {
    super(props);
  };

  render() {

    const {
      redirectToJobPage,
      openNewJobModal,
      catchApiUnauthorized,
      accountEditingModalOpenerFactory,
      accountPropDeletingModalOpenerFactory,
      areAnyModalsOpen,
      getJobPagePath
    } = this.props;

    const style = getStyle(this.props.windowWidth);

    return (
      <>
        <PageTitle>DASHBOARD</PageTitle>
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
              areAnyModalsOpen,
              getJobPagePath
            }}
          />
        </div>
      </>
    );
  };
}

const Dashboard = (addData(_Dashboard_needsData, 'windowWidth', windowWidthService));

export default Dashboard;