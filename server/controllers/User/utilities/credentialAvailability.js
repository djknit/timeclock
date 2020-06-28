const { User } = require('../../../models');
const { checkForFailure } = require('../../utilities');

module.exports = {
  checkUsernameAndOrEmailAvailability
};

function checkUsernameAndOrEmailAvailability(username, email) {
  let failed = false;
  let messages = [];
  let problems = {};
  return checkUsernameAvailability(username)
  .then(isAvailable => {
    if (!isAvailable) {
      failed = true;
      messages.push('That username is taken.');
      problems.username = true;
    }
    return checkEmailAvailability(email);
  })
  .then(isAvailable => {
    if (!isAvailable) {
      failed = true;
      messages.push('There is already an account for that email address.');
      problems.email = true;
    }
    checkForFailure(failed, messages, problems, 422);
    return true;
  })
}

function checkUsernameAvailability(username) {
  return new Promise((resolve, reject) => {
    if (username) {
      User.findOne({ username })
      .then(user => resolve(!user));
    }
    else return resolve(true)
  });
}

function checkEmailAvailability(email) {
  return new Promise((resolve, reject) => {
    if (email) {
      User.findOne({ lowercaseEmail: email.toLowerCase() })
      .then(user => resolve(!user));
    }
    else return resolve(true)
  });
}