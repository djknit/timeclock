export * from './currency';
export * from './time';
export * from './wage';

/*
For use in the component where the form state is kept (top-level component for form).
The factory fxn returned by the outer factory fxn should be attached as a method to component and passed as prop to children.
Children then call the inner factory function to generate the change handler function for that input component.
*/
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

/*
For use in "middle components": child components of form which contain multiple inputs (form sections of related inputs)
Middle component calls factory that was passed down from it's parent to generate change handler for reporting changes to parent.
This change handler is passed as parameter to outer factory below to create factory for middle component to pass to it's children.
Children use the factory to generate change handler exactly as they would with the factories created by the top-level component and passed it's direct children.
*/
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