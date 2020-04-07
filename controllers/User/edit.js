const { determineUserInfoError } = require('./utilities');

module.exports = {
  editAccountInfo
};

function editAccountInfo(user, updatedProps) {
  return new Promise((resolve, reject) => {
    let { username, password, email } = updatedProps;
    if (password === null) {
      const err = new Error('Can\'t set password to null.');
      reject(err);
      throw err;
    }
    if (username === null && email === null) {
      const err = new Error('Can\'t set both username and email to null.');
      reject(err);
      throw(err);
    }
    if (typeof(username) === 'string' || username === null) user.username = username;
    if (typeof(email) === 'string') {
      user.email = email;
      user.lowercaseEmail = email.toLowerCase();
    }
    else if (email === null) {
      user.email = null;
      user.lowercaseEmail = undefined
    }
    if (typeof(password) === 'string') user.password = password;
    if (username === undefined && email === undefined && password === undefined) {
      const err = new Error('No valid info properties.');
      reject(err);
      throw err;
    }
    user.save((err, user) => {
      if (err) {
        return reject(determineUserInfoError(err));
      }
      else if (user) {
        // console.log(user)
        return resolve(user);
      }
      const unexpectedErr = new Error('Unexpected outcome. Reason unknown.');
      reject(unexpectedErr);
      throw unexpectedErr;
    });
  });
}