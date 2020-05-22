import { dataServiceFactory } from '../../utilities';

let isLoggedIn = false;

const service = dataServiceFactory({
  readFunction: () => isLoggedIn,
  methods: {
    setValue(newValue) {
      isLoggedIn = newValue;
    }
  }
});

export default service;