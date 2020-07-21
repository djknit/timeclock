import React, { Component } from 'react';
import getStyle from './style';
import { windowWidthService } from '../../../data'
import PageTitle from '../PageTitle';
import Jobs from './Jobs';
import Account from './Account';
import { addData, addHeightTracking } from '../../higherOrder';

class _Dashboard_needsDataAndHeightTracking extends Component {
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
      heightTracking
    } = this.props;

    const style = getStyle(this.props.windowWidth, heightTracking.maxHeight);

    return (
      <>
        <PageTitle>DASHBOARD</PageTitle>
        <div style={style.contentAreasRow}>
          <Account
            areaRef={heightTracking.ref1}
            style={style.account}
            {...{
              accountEditingModalOpenerFactory,
              accountPropDeletingModalOpenerFactory,
              areAnyModalsOpen
            }}
          />
          <Jobs
            areaRef={heightTracking.ref2}
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

const _Dashboard_needsHeightTracking = (
  addData(_Dashboard_needsDataAndHeightTracking, 'windowWidth', windowWidthService)
);

const Dashboard = addHeightTracking(_Dashboard_needsHeightTracking);

export default Dashboard;