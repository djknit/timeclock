const { models, determineUserInfoError, checkUsernameAndOrEmailAvailability } = require('./utilities');
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
    .then(() => {
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