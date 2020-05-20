export default weekDataStoreFactory;

function weekDataStoreFactory() {
  let _firstDateUtcTime, _lastDateUtcTime;

  const documentStore = weekDocDataStoreFactory();

  return {
    get firstDateUtcTime() {
      return _firstDateUtcTime;
    },
    get lastDateUtcTime() {
      return _lastDateUtcTime;
    },
    get document() {
      return documentStore.value;
    }
  };
}

function weekDocDataStoreFactory() {
  
  let _firstDate, _lastDate, _weekNumber, _days;
  
  return {
    get firstDate() {
      return { ..._firstDate };
    },
    get lastDate() {
      return { ..._lastDate };
    },
    get weekNumber() {
      return _weekNumber;
    }
  };
}