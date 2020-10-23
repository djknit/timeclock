import { dataServiceFactory } from './utilities';

let state = { windowWidth: undefined };

const service = dataServiceFactory({
  readFunction: () => state.windowWidth,
  methods: {
    reportChange(newWidth) {
      state.windowWidth = newWidth;
    }
  },
  maxListeners: 40
});

export default service;