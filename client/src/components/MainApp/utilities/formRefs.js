import React from 'react';

const wageRefNames = [
  'radioUseWageTrue',
  'radioUseWageFalse',
  'radioUseOvertimeTrue',
  'radioUseOvertimeFalse',
  'radioUseMultiplierTrue',
  'radioUseMultiplierFalse'
];

const wkDayCutoffsRefNames = [
  'radioUseDefaultCutoffsTrue',
  'radioUseDefaultCutoffsFalse'
];


function addRefs(targetComponent, refNames) {
  refNames.forEach(refName => {
    targetComponent[refName] = React.createRef();
  });
}

function addWageInputRefs(targetComponent) {
  addRefs(targetComponent, wageRefNames);
}

function addWkDayCutoffsInputRefs(targetComponent) {
  addRefs(targetComponent, wkDayCutoffsRefNames);
}


function extractRefs(component, refNames) {
  let result = {};
  refNames.forEach(refName => {
    result[refName] = component[refName];
  });
  return result;
}

function extractWageInputRefs(component) {
  return extractRefs(component, wageRefNames);
}

function extractWkDayCutoffsInputRefs(component) {
  return extractRefs(component, wkDayCutoffsRefNames);
}


export {
  addWageInputRefs,
  addWkDayCutoffsInputRefs,
  extractWageInputRefs,
  extractWkDayCutoffsInputRefs
};