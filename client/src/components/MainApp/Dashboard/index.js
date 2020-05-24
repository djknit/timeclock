import React, { Component } from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from  '../ContentArea';
import Jobs from './Jobs';
import Account from './Account';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const style = getStyle();

    return (
      <>
        <ContentArea style={style.pageTitleArea}>
          <ContentAreaTitle style={style.pageTitle} size={2}>DASHBOARD</ContentAreaTitle>
        </ContentArea>
        <Jobs />
        <Account />
      </>
    );
  };
}

export default Dashboard;