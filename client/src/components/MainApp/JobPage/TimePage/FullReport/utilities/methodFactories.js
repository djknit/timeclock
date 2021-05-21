export {
  methodsRegMgmtFactory,
  attachRegistrationMgmtMethods
};


function attachRegistrationMgmtMethods(component, regMethodName, methodsArrStatePropName) {
  component[regMethodName] = methodsRegMgmtFactory(methodsArrStatePropName, false).bind(component);
  component[`un${regMethodName}`] = methodsRegMgmtFactory(methodsArrStatePropName, true).bind(component);
}

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
