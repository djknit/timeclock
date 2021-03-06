const utilities = require('../../../utilities');
const resCleaners = require('./resCleaners');

const { processErrorForRes } = utilities;
const { cleanWeeks } = resCleaners;

module.exports = {
  ...utilities,
  ...resCleaners,
  checkRequiredProps,
  weeksSenderFactory,
  sendWeeksAndErrorRes
};

function checkRequiredProps(props, requiredPropNames, res) {
  let problems = {};
  let problemMessages = [];
  requiredPropNames.forEach(name => {
    checkRequiredProp(props, name, problems, problemMessages, name);
  });
  if (problemMessages.length > 0) {
    res.status(400).json({
      messages: problemMessages,
      problems
    });
    throw new Error('Missing required input for route.');
  }
}

function checkRequiredProp(props = {}, propName, problems, problemMessages, propDisplayName) {
  const dotIndex = propName.indexOf('.');
  if (dotIndex > -1) {
    const parentPropName = propName.slice(0, dotIndex);
    const childPropName = propName.slice(dotIndex + 1);
    return checkRequiredProp(props[parentPropName], childPropName, problems, problemMessages, propDisplayName);
  }
  const prop = props[propName];
  if (!prop && prop !== 0 && prop !== '') {
    addProblem(propDisplayName, problems);
    problemMessages.push('Missing `' + propDisplayName + '`.');
  }
}

function addProblem(propDisplayName, problems) {
  const propDisplayNameLevels = propDisplayName.split('.');
  let parentProblemLevel = problems;
  const numberOfLevels = propDisplayNameLevels.length;
  for (let i = 0; i < numberOfLevels; i++) {
    let currentLevelName = propDisplayNameLevels[i];
    if (i === numberOfLevels - 1) {
      parentProblemLevel[currentLevelName] = true;
      return;
    }
    parentProblemLevel[currentLevelName] = {};
    parentProblemLevel = parentProblemLevel[currentLevelName];
  }
}

function weeksSenderFactory(res) {
  return (({ weeks }) => {
    res.json({ weeks: weeks && cleanWeeks(weeks) });
  });
}

function sendWeeksAndErrorRes(res, job, error, resData) {
  let fullResData = {
    weeks: cleanWeeks(job.weeks),
    ...resData 
  };
  if (error) {
    const { status, data } = processErrorForRes(error);
    fullResData.error = { status, ...data };
  }
  res.status(error ? 207 : 200).json(fullResData);
}
