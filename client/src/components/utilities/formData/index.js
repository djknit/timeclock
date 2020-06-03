export * from './currency';

function changeHandlerFactoryFactory(callback) {
  return function changeHandlerFactory(propName, isEvent, processValue) {
    return (eventOrValue) => {
      let value = isEvent ? eventOrValue.target.value : eventOrValue;
      if (processValue) value = processValue(value);
      return (
        callback ?
        this.setState(
          { [propName]: value },
          () => callback(propName)
        ) :
        this.setState({ [propName]: value })
      );
    };
  };
}

function changeHandlerFactoryForChildrenFactory(handleChange) {
  return function changeHandlerFactory(propName, isEvent, processValue) {
    return (eventOrValue) => {
      let value = isEvent ? eventOrValue.target.value : eventOrValue;
      if (processValue) value = processValue(value);
      handleChange(propName, value);
    };
  };
}

export {
  changeHandlerFactoryFactory,
  changeHandlerFactoryForChildrenFactory
};