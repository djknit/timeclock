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

service.getRegistrationId = function() {
  return state.newId;
};

service.reportModalsOpen = function(reporterId, reporterHasModalsOpen = true) {
  const wereModalsOpen = state.areAnyModalsOpen;
  const _markState = reporterHasModalsOpen ? state.markOpen : state.markClosed;
  _markState(reporterId);
  if (state.areAnyModalsOpen !== wereModalsOpen) {
    service._emit();
  }
};

export default service;