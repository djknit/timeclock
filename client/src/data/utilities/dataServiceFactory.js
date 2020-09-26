// ABOUT THIS FILE:
// I got the general idea that I am using for these data stores from the following source.
// https://codeutopia.net/blog/2016/02/01/react-application-data-flow-where-and-how-to-store-your-data/
// This source also introduced me to the 'events' module and its usage.

const EventEmitter = require('events');

export default function dataServiceFactory({
  readFunction,
  methods = {},
  isAsync,
  maxListeners,
  setFunction,
  clearFunction
}) {

  const emitter = new EventEmitter();

  if (maxListeners) {
    emitter.setMaxListeners(maxListeners);
  }

  let dataService = {
    getValue: readFunction,
    subscribe(callback) {
      emitter.on('change', callback);
      return () => this.unsub(callback);
    },
    unsub(callback) {
      emitter.removeListener('change', callback);
    },
    _emit() {
      emitter.emit('change');
    },
    // next 2 lines are only used to make VS code suggest autocomplete for when using data service
    setValue: setFunction ? (() => { }) : undefined,
    clearValue: clearFunction ? (() => { }) : undefined
  };

  if (setFunction) methods.setValue = setFunction;
  if (clearFunction) methods.clearValue = clearFunction;

  const methodKeys = Object.keys(methods);

  // copy methods to dataService so that event emitter is triggered when methods are called
  // methods should all be synchronous or all asynchronous but NOT a mix of both
  methodKeys.forEach(methodKey => {
    dataService[methodKey] = function(...args) {
      if (isAsync) {
        return new Promise((resolve, reject) => {
          methods[methodKey](...args)
          .then(result => {
            emitter.emit('change');
            resolve(result);
          })
          .catch(reject);
        });
      }
      else {
        const result = methods[methodKey](...args);
        emitter.emit('change');
        return result;
      }
    };
  });

  return dataService;
};