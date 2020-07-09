import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import getStyle from './style';
import PageTitle from '../../PageTitle';
import ContentArea, { ContentAreaTitle } from '../../ContentArea';

class TimePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {

    const { job, parentPath } = this.props;

    const crumbChain = [
      {
        text: <>JOB:&nbsp;{job.name}</>,
        url: parentPath
      },
      { text: 'Time' }
    ];

    const style = getStyle();

    return (
      <>
        <PageTitle {...{ crumbChain }} />
        <ContentArea>
          <ContentAreaTitle>Time Stuff</ContentAreaTitle>
        </ContentArea>
      </>
    );
  };
}

export default TimePage;