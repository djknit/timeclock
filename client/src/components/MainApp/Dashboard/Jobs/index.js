import React, { Component } from 'react';
import getStyle from './style';
import { jobsService, currentJobService } from '../../../../data';
import { formatMyDate, api, promiseToSetState } from '../../utilities';
import ContentArea, { ContentAreaTitle } from '../../ContentArea';
import Button from '../../../Button';
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
        currentJobService.setCurrentJob(res.data);
        this.props.redirectToJobPage(jobId);
      })
      .catch(err => {
        if (this.props.catchApiUnauthorized(err)) return;
        this.setState({
          isLoading: false,
          hasProblem: true,
          problemMessages: [err && err.message || 'An unknown problem was encountered.']
        });
      })
      
    };
  };

  render() {
    const style = getStyle(this.props.style);

    const { jobs, openNewJobModal, areAnyModalsOpen, areaRef } = this.props;

    return (
      <ContentArea style={style.contentArea} {...{ areaRef }}>
        <ContentAreaTitle style={style.areaTitle}>Your Jobs</ContentAreaTitle>
        <Button
          styles={style.addJobButton}
          theme="primary"
          onClick={openNewJobModal}
          allowTabFocus={!areAnyModalsOpen}
        >
          <i className="fas fa-plus"></i> New
        </Button>
        <table className="table is-fullwidth" style={style.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
            </tr>
          </thead>
          <tbody>
            {jobs && jobs.map(
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
      </ContentArea>
    );
  };
}

const Jobs = addData(_Jobs_needsData, 'jobs', jobsService);

export default Jobs;