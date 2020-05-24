const { models, determineUserInfoError, checkForFailure } = require('./utilities');
const { User } = models;

module.exports = {
  createAccount
};

function createAccount(newUser) {
  return new Promise((resolve, reject) => {
    const { email, username, password } = newUser;
    if ((!username && !email) || !password) {
      const error = new Error('Missing credentials.');
      reject(error);
      throw error;
    }
    checkUsernameAndOrEmailAvailability(username, email)
    .then(isAvailable => {
      const lowercaseEmail = (typeof(email) === 'string') ? email.toLowerCase() : undefined;
      const processedNewUser = lowercaseEmail ? { lowercaseEmail, ...newUser } : newUser;
      return createAndSaveUser(processedNewUser);
    })
    .then(resolve)
    .catch(reject);
  });
}

function createAndSaveUser(processedNewUser) {
  return new Promise((resolve, reject) => {
    const user = new User(processedNewUser);
    user.save((err, user) => {
      if (err) {
        return reject(determineUserInfoError(err));
      }
      else if (user) {
        return resolve(user);
      }
      const unexpectedErr = new Error('Unexpected outcome. Reason unknown.');
      reject(unexpectedErr);
      throw unexpectedErr;
    });
  });
}

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