import React, { Component } from 'react';
import { currentJobService } from '../../../data';
import { api } from '../utilities'
import getStyle from './style';
import { addData } from '../../higherOrder';

class _JobPage_needsData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      hasProblem: false,
      problemMessages: []
    };
  };

  componentDidMount() {
    const { job, match } = this.props;
    const { jobId } = match.params;
    if (!job || job.id !== jobId) {
      api.jobs.get(jobId)
      .then(res => {
        if (!res || !res.data) throw new Error('Failed to retrieve for data for job.');
        currentJobService.setCurrentJob(res.data);
      })
      .catch(err => {
        let problemMessages;
        if (err && err.response && err.response.data && err.response.data.problemMessages) {
          problemMessages = err.response.data.problemMessages;
        }
        else if (err && err.message) {
          problemMessages = [err.message];
        }
        else {
          problemMessages = ['An unknown problem was encountered.'];
        }
        this.setState({
          hasProblem: true,
          problemMessages
        });
      });
    }
  };

  render() {
    const { job } = this.props;

    const style = getStyle();

    return (
      <div style={style.jobsArea}>{job && job.name}</div>
    );
  };
}

const JobPage = addData(_JobPage_needsData, 'job', currentJobService);

export default JobPage;