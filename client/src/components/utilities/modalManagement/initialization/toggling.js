function modalTogglerFactoryFactory(reportModalActivity) {

  return function (
    modalIsOpenStatePropName, inputRef, otherStatePropToEditName, inputFocusMethodName
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
  
    return (isOpenAfterToggle, otherPropToEditValue) => {
      let stateUpdates = { [modalIsOpenStatePropName]: !!isOpenAfterToggle };
      if (otherStatePropToEditName && otherPropToEditValue !== undefined) {
        stateUpdates[otherStatePropToEditName] = otherPropToEditValue;
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