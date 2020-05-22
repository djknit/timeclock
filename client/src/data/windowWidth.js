import { dataServiceFactory } from '../utilities';

let windowWidth;

const service = dataServiceFactory({
  readFunction: () => windowWidth,
  methods: {
    reportChange(newWidth) {
      windowWidth = newWidth;
    }
  }
});

export default service;