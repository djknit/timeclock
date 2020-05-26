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
      console.log(event.target)
      console.log(jobId)
      promiseToSetState(this, { isLoading: true })
      .then(() => api.jobs.get(jobId))
      .then(res => {
        if (!res || !res.data) throw new Error('Failed to retrieve for data for job.');
        currentJobService.setCurrentJob(res.data);
        console.log(res.data)
        this.props.redirectToJobPage(jobId);
      })
      .catch(err => {
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

    const { jobs } = this.props;
    console.log(jobs)

    return (
      <ContentArea style={style.contentArea}>
        <ContentAreaTitle style={style.areaTitle}>Your Jobs</ContentAreaTitle>
        <Button styles={style.addJobButton} color="primary">
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