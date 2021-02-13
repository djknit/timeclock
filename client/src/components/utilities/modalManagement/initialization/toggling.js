function modalTogglerFactoryFactory(reportModalActivity) {

  return function (
    modalIsOpenStatePropName,
    inputRef,
    otherStatePropToEditName,
    inputFocusMethodName,
    thirdStatePropToEditName
  ) {

    const _focusInput = () => {
      if (!this.state[modalIsOpenStatePropName] || !inputRef) return;
      if (inputRef.current) {
        const methodName = inputFocusMethodName || 'focus';
        inputRef.current[methodName]();
      }
      else {
        setTimeout(_focusInput, 100);
      }
    };
  
    return (isOpenAfterToggle, otherPropVal, thirdPropVal) => {
      let stateUpdates = { [modalIsOpenStatePropName]: !!isOpenAfterToggle };
      if (otherStatePropToEditName && otherPropVal !== undefined) {
        stateUpdates[otherStatePropToEditName] = otherPropVal;
      }
      if (thirdStatePropToEditName && thirdPropVal !== undefined) {
        stateUpdates[thirdStatePropToEditName] = thirdPropVal;
      }
      this.setState(
        stateUpdates,
        () => {
          if (isOpenAfterToggle) {
            _focusInput();
          }
          reportModalActivity();
        }
      );
    };
  };
}

export {
  modalTogglerFactoryFactory
};
