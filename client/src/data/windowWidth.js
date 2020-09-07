import { dataServiceFactory } from './utilities';

let windowWidth;

const service = dataServiceFactory({
  readFunction: () => windowWidth,
  methods: {
    reportChange(newWidth) {
      windowWidth = newWidth;
    }
  },
  maxListeners: 40
});

export default service;