import React, { Component } from 'react';
import getStyle from './style';
import moment from 'moment';
import { jobsService } from '../../../../data';
import ContentArea, { ContentAreaTitle } from '../../ContentArea';
import Button from '../../../Button';
import TableRow from './TableRow';
import { addData } from '../../../higherOrder';

class _Jobs_needsData extends Component {
  constructor(props) {
    super(props);
    this.jobClickHandlerFactory = this.jobClickHandlerFactory.bind(this);
  };

  jobClickHandlerFactory(jobId) {
    return (event) => {
      console.log(event.target)
      console.log(jobId)
    };
  };

  render() {
    const style = getStyle(this.props.style);

    const { jobs } = this.props;

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
                  <td>{moment(job.startDate).format('MMM D, YYYY')}</td>
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