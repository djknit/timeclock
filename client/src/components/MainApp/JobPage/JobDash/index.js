import React, { Component } from 'react';
import PageTitle from '../../PageTitle';

class JobDash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    const { job } = this.props;

    return (
      <>
        <PageTitle>JOB: {job.name}</PageTitle>
        
      </>
    );
  };
}

export default JobDash;