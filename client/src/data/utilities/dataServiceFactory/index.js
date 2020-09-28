// ABOUT THIS FILE:
// I got the general idea that I am using for these data stores from the following source.
// https://codeutopia.net/blog/2016/02/01/react-application-data-flow-where-and-how-to-store-your-data/
// This source also introduced me to the 'events' module and its usage.

import addMethods from './addMethods';
import addChildServices from './addChildServices';

const EventEmitter = require('events');

export default function dataServiceFactory({
  state, // not needed if there are no child services
  readFunction,
  methods = {},
  isAsync,
  maxListeners,
  setFunction: setValue,
  clearFunction: clearValue,
  childDataServices = {}
}) {

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
    // Next 2 lines will be overwritten. Placed here so that VS Code suggests autocomplete when using service.
    setValue,
    clearValue
  };

  /* About "Special Methods":
    Special methods are methods that invoke methods on all child services (when children exist).
    Regular methods cause service to emit change immediately. Special methods cause service to emit change immediately only when there are no child services. When child services exist, no change should be emitted on special method invocation until every child service has emitted and the new child values have been set on the parent sevice.
  */
  const specialMethods = { setValue, clearValue };

  /* Treat special methods as regular methods, but will be overwritten again during `addChildServices` if child services exist. */
  methods = { ...methods, ...specialMethods };

  addMethods({ methods, dataService, isAsync });

  addChildServices({ dataService, state, childDataServices, specialMethods });

  return dataService;
};