// ABOUT THIS FILE:
// I got the general idea that I am using for these data stores from the following source.
// https://codeutopia.net/blog/2016/02/01/react-application-data-flow-where-and-how-to-store-your-data/
// This source also introduced me to the 'events' module and its usage.

const EventEmitter = require('events');

export default function dataServiceFactory({
  state,
  readFunction,
  methods = {},
  isAsync,
  maxListeners,
  setFunction,
  clearFunction,
  childDataServices = {}
}) {

  // const childServicePropNames = Object.keys(childDataServices);

  // function getValueFromChildService(propName) {
  //   state[propName] = childDataServices[propName].getValue();
  // }

  // childServicePropNames.forEach(getValueFromChildService)

  // let numSubServiceResponsesNeeded = 0; // used to keep service from `_emit`ing after `setValue` is called until all values are set

  const emitter = new EventEmitter();

  if (maxListeners) emitter.setMaxListeners(maxListeners);

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
    // next 2 lines are only used to make VS Code suggest autocomplete for these methods when using data service
    setValue: setFunction ? (() => { }) : undefined,
    clearValue: clearFunction ? (() => { }) : undefined
  };

  if (setFunction) methods.setValue = setFunction;
  if (clearFunction) methods.clearValue = clearFunction;

  const methodNames = Object.keys(methods);

  // copy methods to dataService so that event emitter is triggered when methods are called
  // methods should all be synchronous or all asynchronous but NOT a mix of both
  methodNames.forEach(methodName => {
    dataService[methodName] = function(...args) {
      if (isAsync) {
        return new Promise((resolve, reject) => {
          methods[methodName](...args)
          .then(result => {
            // emitter.emit('change');
            dataService._emit();
            resolve(result);
          })
          .catch(reject);
        });
      }
      else {
        const result = methods[methodName](...args);
        // emitter.emit('change');
        dataService._emit();
        return result;
      }
    };
  });

  return dataService;
};