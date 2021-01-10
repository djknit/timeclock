function addProblemsObjToExisting(problems, newProblems) {
  if (!newProblems) return;
  ['startDate', 'endDate'].forEach(singleProbMergerFactory(problems, newProblems));
  ['startTime', 'endTime'].forEach(propName => {
    addTimeInputProbsTo(problems, newProblems[propName], propName);
  });
}

function addTimeInputProbsTo(problems, timeInputProbs, propName) {
  if (!timeInputProbs) return;
  if (!problems[propName]) {
    problems[propName] = timeInputProbs;
    return;
  }
  ['hour', 'minute', 'amPm'].forEach(
    singleProbMergerFactory(problems[propName], timeInputProbs)
  );
}

function singleProbMergerFactory(existingProblems, newProblems) {
  return function(propName) {
    existingProblems[propName] = newProblems[propName] || existingProblems[propName];
  };
}

export { addProblemsObjToExisting };
