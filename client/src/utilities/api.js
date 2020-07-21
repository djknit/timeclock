import axios from 'axios';

function createAxiosInstance(path) {
  return axios.create({
    baseURL: `/api/${path}`
  });
}

const authAxios = createAxiosInstance('auth');
const jobsAxios = createAxiosInstance('jobs');
const timeAxios = createAxiosInstance('time');

export const auth = {
  login({ usernameOrEmail, password }) {
    return authAxios.post('/login', { usernameOrEmail, password });
  },
  createAccount(newUser) {
    return authAxios.post('/create-account', newUser);
  },
  logout() {
    return authAxios.post('/logout');
  },
  deleteAccount({ password }) {
    return authAxios.post('/delete-account', { password });
  },
  editInfo({ password, updatedProps }) {
    return authAxios.post('/edit-info', { password, updatedProps });
  },
  test() {
    return authAxios.get('/test');
  }
};

export const jobs = {
  create({ name, timezone, startDate }) {
    return jobsAxios.post('/create', { name, timezone, startDate });
  },
  delete({ jobId, password }) {
    return jobsAxios.post(`/delete/${jobId}`, { password });
  },
  updateSetting(propName, { jobId, updates }) {
    return jobsAxios.post(`/update-setting/${propName}`, { jobId, updates });
  },
  rename({ jobId, name }) {
    console.log(jobId)
    return jobsAxios.post(`/rename/${jobId}`, { name });
  },
  get(jobId) {
    return jobsAxios.get(`/${jobId}`);
  }
};

export const time = {
  addSegmentToDay() {

  },
  addSegment() {

  },
  deleteSegment() {

  },
  deleteSegmentsForDateRange() {

  },
  deleteSegmentsForDayIds() {

  }
};

export default { auth, jobs, time };