export default function addChildServices({
  dataService,
  childDataServices,
  specialMethods,
  state
}) {

  const childServicePropNames = Object.keys(childDataServices);

  const numChildServices = childServicePropNames.length;

  if (numChildServices === 0) return;

  function getValueFromChildService(propName) {
    state[propName] = childDataServices[propName].getValue();
  }

  childServicePropNames.forEach(getValueFromChildService);

  let numSubServiceResponsesNeeded = 0; // used to keep service from emitting change after special method is invoked until all values are set

  Object.keys(specialMethods).forEach(methodName => {
    const specialMethod = specialMethods[methodName];
    dataService[methodName] = specialMethod && (
      (...args) => {
        numSubServiceResponsesNeeded = numChildServices;
        specialMethod(...args);
      }
    );
  });

  childServicePropNames.forEach(propName => {
    childDataServices[propName].subscribe(() => {
      getValueFromChildService(propName);
      if (numSubServiceResponsesNeeded > 0) --numSubServiceResponsesNeeded;
      if (numSubServiceResponsesNeeded === 0) dataService._emit();
    });
  });
};