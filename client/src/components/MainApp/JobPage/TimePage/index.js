import React, { Component } from 'react';
import getStyle from './style';
import { areModalsOpenService } from '../../../../data';
import { modalTogglerFactoryFactory, addReportModalActivity } from './utilities';
import PageTitle from '../../PageTitle';
import GeneralEntry from './GeneralEntry';
import Summary from './Summary';
import Weeks from './Weeks';

class TimePage extends Component {
  constructor(props) {
    super(props);
    this.entryModalInputRef = React.createRef();
    this.modalTogglerFactory = modalTogglerFactoryFactory().bind(this);
    this.toggleEntryModal = (
      this.modalTogglerFactory('isGeneralTimeEntryModalActive', this.entryModalInputRef).bind(this)
    );
    this.toggleDeleteSegmentModal = this.modalTogglerFactory('isDeleteSegmentModalActive');
    addReportModalActivity(this, ['isGeneralTimeEntryModalActive', 'isDeleteSegmentModalActive']);
    this.state = {
      isGeneralTimeEntryModalActive: false,
      isDeleteSegmentModalActive: false,
      modalsRegistrationId: undefined
    };
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
          <GeneralEntry
            style={style.generalEntryArea}
            {...{ job }}
          />
        </div>
        <Weeks />
      </>
    );
  };
}

export default TimePage;
