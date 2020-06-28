const { determineUserInfoError, checkUsernameAndOrEmailAvailability } = require('./utilities');

module.exports = {
  editAccountInfo
};

function editAccountInfo(user, updatedProps) {
  return new Promise((resolve, reject) => {
    validateUpdatedProps(updatedProps);
    checkUsernameAndOrEmailAvailability(updatedProps.username, updatedProps.email)
    .then(() => {
      addUpdatedPropsToUser(user, updatedProps);
      return saveUser(user);
    })
    .then(resolve)
    .catch(reject);
  });
}

function validateUpdatedProps(updatedProps) {
  let { username, password, email } = updatedProps;
  if (password === null) {
    let err = new Error('Can\'t set password to null.');
    err.problems = { password: true };
    throw err;
  }
  if (username === null && email === null) {
    let err = new Error('Can\'t set both username and email to null.');
    err.problems = {
      username: true,
      email: true
    };
    throw err;
  }
  if (username === undefined && email === undefined && password === undefined) {
    let err = new Error('No valid info properties.');
    err.problems = {
      username: true,
      email: true,
      password: true
    };
    throw err;
  }
}

function addUpdatedPropsToUser(user, updatedProps) {
  let { username, password, email } = updatedProps;
  if (typeof(username) === 'string' || username === null) user.username = username;
  if (typeof(email) === 'string') {
    user.email = email;
    user.lowercaseEmail = email.toLowerCase();
  }
  else if (email === null) {
    user.email = null;
    user.lowercaseEmail = undefined;
  }
  if (typeof(password) === 'string') user.password = password;
}

function saveUser(user) {
  return new Promise((resolve, reject) => {
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