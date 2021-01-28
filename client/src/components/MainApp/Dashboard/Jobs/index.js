import React, { Component } from 'react';
import getStyle from './style';
import { jobsService, currentJobService } from '../../../../data';
import { formatMyDate, api, promiseToSetState } from '../../utilities';
import { ProgressBar } from '../../../formPieces';
import ContentArea, { ContentAreaTitle } from '../../ContentArea';
import Button from '../../../Button';
import Notification, { NotificationText } from '../../../Notification';
import TableRow from './TableRow';
import { addData } from '../../../higherOrder';

class _Jobs_needsData extends Component {
  constructor(props) {
    super(props);
    this.jobClickHandlerFactory = this.jobClickHandlerFactory.bind(this);
    this.state = {
      isLoading: false,
      hasProblem: false,
      problemMessages: []
    };
  };

  jobClickHandlerFactory(jobId) {
    return (event) => {
      promiseToSetState(this, { isLoading: true })
      .then(() => api.jobs.get(jobId))
        .then(res => {
        if (!res || !res.data) throw new Error('Failed to retrieve for data for job.');
        currentJobService.setValue(res.data);
        this.props.redirectToJobPage(jobId);
      })
      .catch(err => {
        if (this.props.catchApiUnauthorized(err)) return;
        this.setState({
          isLoading: false,
          hasProblem: true,
          problemMessages: [err && err.message || 'An unknown problem was encountered.']
        });
      });
    
    };
  };

  render() {
    const style = getStyle(this.props.style);

    const { jobs, openNewJobModal, areAnyModalsOpen } = this.props;

    return (
      <ContentArea style={style.contentArea}>
        <ContentAreaTitle style={style.areaTitle}>Your Jobs</ContentAreaTitle>
        <Button
          styles={style.addJobButton}
          theme="primary"
          onClick={openNewJobModal}
          allowTabFocus={!areAnyModalsOpen}
        >
          <i className="fas fa-plus"></i> New
        </Button>
        {jobs && jobs.length > 0 ? (
          <table className="table is-fullwidth" style={style.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(
                job => (
                  <TableRow
                    key={job._id}
                    styles={style.trStyles}
                    onClick={this.jobClickHandlerFactory(job._id)}
                    allowTabFocus={!areAnyModalsOpen}
                  >
                    <td>{job.name}</td>
                    <td>{formatMyDate(job.startDate)}</td>
                  </TableRow>
                )
              )}
            </tbody>
          </table>
        ) : (
          <Notification theme="info" isLastChild>
            {jobs ? ( // array exists, but no jobs
              [
                'Getting Started',
                'You don\'t have any jobs yet.',
                'Add a job to start tracking your hours.',
                'There is no limit to the number of jobs that you can have.'
              ].map((text, index, arr) => (
                <NotificationText
                  key={index}
                  children={text}
                  style={index === 0 ? style.noJobNotificationTitle : undefined}
                  isLast={index === arr.length - 1}
                />
              ))
            ) : (
              <>
                <NotificationText>Retrieving jobs...</NotificationText>
                <ProgressBar theme="primary" />
              </>
            )}
          </Notification>
        )}
        
      </ContentArea>
    );
  };
}

const Jobs = addData(_Jobs_needsData, 'jobs', jobsService);

export default Jobs;