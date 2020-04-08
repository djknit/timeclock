const models = require('../../../models');
const { checkForFailure } = require('../../utilities');

module.exports = {
  models,
  checkForFailure,
  determineUserInfoError
};

function determineUserInfoError(err) {
  const { code, errors, errmsg } = err;
  let problemMessages = [];
  let problems = {};
  let status;
  if (code === 11000) {
    if (errmsg.indexOf('username') > -1) {
      return {
        message: 'That username is unavailable.',
        problems: { username: true },
        status: 422
      };
    }
    if (errmsg.indexOf('lowercaseEmail') > -1) {
      return {
        message: 'There is already an account for that email address.',
        problems: { email: true },
        status: 422
      };
    }
  }
  if (!errors) {
    return new Error('An unknown problem was encountered.');
  }
  if (errors.password) {
    problemMessages.push(errors.password.message);
    problems.password = true;
    status = 422;
  }
  if (errors.username) {
    problemMessages.push(errors.username.message);
    problems.username = true;
    status = 422;
  }
  if (errors.lowercaseEmail) {
    problemMessages.push(errors.lowercaseEmail.message.replace('lowercaseEmail', 'email'));
    problems.email = true;
    status = 422;
  }
  if (problemMessages.length > 0) {
    return {
      messages: problemMessages,
      problems,
      status
    };
  }
  return new Error('An unknown problem was encountered.');
}