import { dataServiceFactory } from '../../../../utilities';

let weeks;

const service = dataServiceFactory({
  readFunction: () => weeks && [...weeks],
  methods: {

  }
});

export default service;