import { createAxiosInstance } from './elemental';

const jobsAxios = createAxiosInstance('jobs');

const jobsApi = {
  create(newJob) {
    return jobsAxios.post('/create', newJob);
  },
  delete({ jobId, password }) {
    return jobsAxios.post(`/delete/${jobId}`, { password });
  },
  updateSetting(propName, { jobId, updates }) {
    // console.log(updates)
    return jobsAxios.post(`/update-setting/${propName}`, { jobId, updates });
  },
  rename({ jobId, name }) {
    return jobsAxios.post(`/rename/${jobId}`, { name });
  },
  get(jobId) {
    return jobsAxios.get(`/${jobId}`);
  }
};

export default jobsApi;