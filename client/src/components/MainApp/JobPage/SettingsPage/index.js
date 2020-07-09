import React, { Component } from 'react';
import PageTitle from '../../PageTitle';

class SettingsPage extends Component {
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
      { text: 'Settings' }
    ];

    return (
      <>
        <PageTitle {...{ crumbChain }} />
        
      </>
    );
  };
}

export default SettingsPage;