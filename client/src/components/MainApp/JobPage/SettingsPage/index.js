import React, { Component } from 'react';
import PageTitle from '../../PageTitle';

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    const { job } = this.props;

    return (
      <>
        <PageTitle>
          JOB:&nbsp;{job.name}&nbsp;&nbsp;<i className="fas fa-chevron-right"></i>&nbsp;&nbsp;Settings
        </PageTitle>
        
      </>
    );
  };
}

export default SettingsPage;