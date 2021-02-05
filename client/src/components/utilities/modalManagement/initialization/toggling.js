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
  
    return (isOpenAfterToggle, otherPropToEditValue, thirdStatePropToEdit) => {
      let stateUpdates = { [modalIsOpenStatePropName]: !!isOpenAfterToggle };
      if (otherStatePropToEditName && otherPropToEditValue !== undefined) {
        stateUpdates[otherStatePropToEditName] = otherPropToEditValue;
      }
      if (thirdStatePropToEditName && thirdStatePropToEdit) {
        stateUpdates[thirdStatePropToEditName] = thirdStatePropToEdit;
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
