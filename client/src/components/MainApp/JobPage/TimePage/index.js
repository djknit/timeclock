import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import getStyle from './style';
import PageTitle from '../../PageTitle';
import CrumbLink from '../../PageTitle/CrumbLink'

class TimePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {

    const { job, parentPath } = this.props;

    const style = getStyle();

    return (
      <>
        <PageTitle crumbChain={[{ text: <>JOB:&nbsp;{job.name}</>, url: parentPath }, { text: 'Time' }]}>
          <CrumbLink to={parentPath}>JOB:&nbsp;{job.name}</CrumbLink>
          <i style={style.breadcrumbSeparator} className="fas fa-chevron-right" />
          <span style={style.currentCrumb}>Time</span>
        </PageTitle>
      </>
    );
  };
}

export default TimePage;