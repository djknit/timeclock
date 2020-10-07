import {
  dataServiceFactory
} from './utilities';

let _id, name, startDate;

const service = dataServiceFactory({
  readFunction: () => (
    _id ?
    { _id, name, startDate } :
    undefined
  ),
  setFunction: job => {
    _id = job._id.toString();
    name = job.name;
    startDate = job.startDate;
  },
  clearFunction: () => {
    _id = name = startDate = undefined;
  },
});

export default service;