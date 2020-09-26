import { currentJobService } from '../data';
import api from './api';

function retrieveAndSetCurrentJob(jobId) {
  return api.jobs.get(jobId)
  .then(res => {
    if (!res || !res.data) throw new Error('Failed to retrieve for data for job.');
    currentJobService.setValue(res.data);
  });
}

export { retrieveAndSetCurrentJob };