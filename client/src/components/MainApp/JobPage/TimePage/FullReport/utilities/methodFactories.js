export { methodsRegMgmtFactory };


function methodsRegMgmtFactory(methodsArrName, isUnregister) {
  return function registerOrUnregisterMethod(method) {
    this.setState(prevState => ({
      [methodsArrName]: (
        isUnregister ?
        prevState[methodsArrName].filter(fxn => fxn !== method) :
        [...prevState[methodsArrName], method]
      )
    }));
  };
}
