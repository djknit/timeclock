import React, { Component } from 'react';
import getStyle from './style';
import PageTitle from '../../PageTitle';
import GeneralEntry from './GeneralEntry';
import Summary from './Summary';
import Weeks from './Weeks';

class TimePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {

    const { job, parentPath, windowWidth } = this.props;
    console.log(job)

    const crumbChain = [
      {
        text: <>JOB:&nbsp;{job.name}</>,
        url: parentPath
      },
      { text: 'Time' }
    ];

    const style = getStyle(windowWidth);

    return (
      <>
        <PageTitle {...{ crumbChain }} />
        <div style={style.contentAreasRow}>
          <Summary
            style={style.summaryArea}
            timeData={job.time}
            {...{ windowWidth }}
          />
          <GeneralEntry style={style.generalEntryArea} />
        </div>
        <Weeks />
      </>
    );
  };
}

export default TimePage;