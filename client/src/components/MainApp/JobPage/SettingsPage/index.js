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
          JOB:&nbsp;{job.name} <i className="fas fa-chevron-right"></i> Settings
        </PageTitle>
        
      </>
    );
  };
}

export default SettingsPage;