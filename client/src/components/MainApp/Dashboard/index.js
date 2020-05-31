import React, { Component } from 'react';
import getStyle from './style';
import { windowWidthService } from '../../../data'
import ContentArea, { ContentAreaTitle } from  '../ContentArea';
import Jobs from './Jobs';
import Account from './Account';
import { addData } from '../../higherOrder';

class _Dashboard_needsData extends Component {
  constructor(props) {
    super(props);
  };

  render() {

    const style = getStyle(this.props.windowWidth);
    const { redirectToJobPage, openNewJobModal, catchApiUnauthorized } = this.props;

    return (
      <>
        <ContentArea style={style.pageTitleArea}>
          <ContentAreaTitle style={style.pageTitle} size={2}>
            DASHBOARD
          </ContentAreaTitle>
        </ContentArea>
        <div style={style.contentAreasRow}>
          <Account style={style.account} />
          <Jobs style={style.jobs} {...{ redirectToJobPage, openNewJobModal, catchApiUnauthorized }} />
        </div>
      </>
    );
  };
}

const Dashboard = addData(_Dashboard_needsData, 'windowWidth', windowWidthService);

export default Dashboard;