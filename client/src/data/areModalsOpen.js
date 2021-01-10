import { dataServiceFactory } from './utilities';

// ABOUT THIS FILE:
/*
  Each component that has modals gets a unique id integer when mounted.
  The id is then added and removed from the list of pages with modals open as needed.
  When component will unmount, make sure the id is not on the list.
*/

let state = {
  _nextId: 0, 
  get newId() {
    return this._nextId++;
  },
  _pagesWithModalsOpen: [],
  get areAnyModalsOpen() {
    return this._pagesWithModalsOpen.length > 0;
  },
  markOpen(registrationId) {
    this._pagesWithModalsOpen.push(registrationId);
  },
  markClosed(registrationId) {
    this._pagesWithModalsOpen = (
      this._pagesWithModalsOpen.filter(el => el !== registrationId)
    );
  }
};

const service = dataServiceFactory({
  readFunction: () => state.areAnyModalsOpen,
  maxListeners: 40
});

service.getId = function() {
  return state.newId;
};

service.report = function(reporterId, reporterHasModalsOpen = true) {
  const wereModalsOpen = state.areAnyModalsOpen;
  const methodName = reporterHasModalsOpen ? 'markOpen' : 'markClosed';
  state[methodName](reporterId);
  if (state.areAnyModalsOpen !== wereModalsOpen) {
    service._emit();
  }
};

export default service;