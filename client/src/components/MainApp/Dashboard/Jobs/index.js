import React, { Component } from 'react';
import getStyle from './style';
import moment from 'moment';
import { jobsService } from '../../../../data';
import ContentArea from '../../ContentArea';
import { addData } from '../../../higherOrder';

class _Jobs_needsData extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const style = getStyle();

    const { jobs } = this.props;

    return (
      <ContentArea title="YOUR JOBS">
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
                <tr key={job._id}>
                  <td>{job.name}</td>
                  <td>{moment(job.startDate).format('MMM D, YYYY')}</td>
                </tr>
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