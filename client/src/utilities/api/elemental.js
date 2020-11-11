import axios from 'axios';

function createAxiosInstance(path) {
  return axios.create({
    baseURL: `/api/${path}`
  });
}

export { createAxiosInstance };