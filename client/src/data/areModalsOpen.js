import { dataServiceFactory } from '../utilities';

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
}

const service = dataServiceFactory({
  readFunction: () => state.areAnyModalsOpen,
  methods: {},
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