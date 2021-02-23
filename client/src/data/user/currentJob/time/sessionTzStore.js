// ABOUT THIS FILE:
  // This is NOT a data service.
  // This data store serves the same purpose as a data service except that it does NOT offer change notification subscriptions (does not emit events).
  // The values can be read anywhere in the app, but the methods should only be invoked by a controlling data service (the 'currentJob' > 'time' service in this case).


import { guessUserTimezone } from './utilities';

let _sessionTimezone, _wasGuessed;
reset();

let sessionTimezoneDataStore = {
  get sessionTimezone() {
    return _sessionTimezone;
  },
  get wasSessionTzGuessed() {
    return _wasGuessed;
  }
};

const getMethodInfo = _method => ({
  value: _method,
  enumerable: false
});

Object.defineProperty(sessionTimezoneDataStore, '_reset', getMethodInfo(reset));
Object.defineProperty(sessionTimezoneDataStore, '_setValue', getMethodInfo(setValue));

export default sessionTimezoneDataStore;


function reset() {
  _sessionTimezone = guessUserTimezone();
  _wasGuessed = true;
}

function setValue(newVal) {
  _sessionTimezone = newVal;
  _wasGuessed = true;
}
