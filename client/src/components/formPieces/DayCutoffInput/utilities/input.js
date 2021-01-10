function inputProcessorFactoryFactory(inputValuePreChange) {
  return function inputProcessorFactory(childPropName) {
    return function processInputChange(childPropValue) {
      const { hour } = inputValuePreChange;
      let _inputValue = { ...inputValuePreChange };
      if (childPropName === 'is24hr') {
        _inputValue[childPropName] = childPropValue && childPropValue !== 'false';
      }
      else if (childPropName !== 'amPm') {
        _inputValue[childPropName] = (
          childPropValue || childPropValue === 0 ?
          parseInt(childPropValue) :
          undefined
        );
      }
      else if (childPropValue === 'am' && hour < 0) {
        _inputValue.hour += 12;
      }
      else if (childPropValue === 'am' && hour === 12) {
        _inputValue.hour = 0;
      }
      else if (childPropValue === 'pm' && hour >= 0 && hour !== 12) {
        _inputValue.hour -= 12;
      }
      return _inputValue;
    };
  };
}

export { inputProcessorFactoryFactory };
