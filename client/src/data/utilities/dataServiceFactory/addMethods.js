import { checkIsWaitingForSiblingResponse } from './elemental';

export default function addMethods({
  methods = {},
  dataService,
  isAsync,
  isWaitingForSiblings
}) {
  
  const methodNames = Object.keys(methods);

  // copy methods to dataService so that event emitter is triggered when methods are called
  // methods should all be synchronous or all asynchronous but NOT a mix of both
  methodNames.forEach(methodName => {
    dataService[methodName] = function(...args) {
      if (isAsync) {
        return new Promise((resolve, reject) => {
          methods[methodName](...args)
          .then(result => {
            if (!isWaitingForSiblings) dataService._emit();
            resolve(result);
          })
          .catch(reject);
        });
      }
      else {
        const result = methods[methodName](...args);
        if (!isWaitingForSiblings) dataService._emit();
        return result;
      }
    };
  });
};
