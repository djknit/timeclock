const User = require('../models/User');

module.exports = {
  createAccount: newUser => new Promise(
    (resolve, reject) => {
      const { email, username, password } = newUser;
      if (!username && !email) {
        return reject({
          message: 'You must supply a username or email address.',
          problems: { username: true, email: true },
          status: 400
        });
      }
      if (!password) {
        return reject({
          message: 'You must supply a password.',
          problems: { password: true },
          status: 400
        });
      }
      const lowercaseEmail = (typeof(email) === 'string') ? email.toLowerCase() : undefined;
      const processedNewUser = lowercaseEmail ? { lowercaseEmail, ...newUser } : newUser
      _createAccount(processedNewUser)
      .then(resolve)
      .catch(reject);
    }
  ),
  findByUsernameOrEmail: usernameOrEmail => new Promise(
    (resolve, reject) => {
      if (typeof(usernameOrEmail) !== 'string') {
        reject(new Error('Bad query type.'))
      }
      else {
        User.findOne({ username: usernameOrEmail })
        .then(user => {
          if (user) {
            resolve(user);
          }
          else {
            resolve(User.findOne({ lowercaseEmail: usernameOrEmail.toLowerCase() }));
          }
        })
        .catch(reject);
      }
    }
  ),
  findById: id => new Promise(
    (resolve, reject) => {
      User.findById(id)
      .then(user => {
        if (!user) throw new Error('User not found by ID.');
        resolve(user);
      })
      .catch(reject);
    }
  ),
  deleteAccount: id => new Promise(
    (resolve, reject) => {
      User.findByIdAndDelete(id)
      .then(result => {
        if (result === null) {
          return reject({ message: 'User not found.' });
        }
        else if (result._id) {
          return resolve({ message: 'Account deletion was successful.' });
        }
        reject({ message: 'An unknown error was encountered.' });
      })
      .catch(reject);
    }
  ),
  editAccountInfo: (id, updatedProps) => new Promise(
    (resolve, reject) => {

    }
  )
}

function _createAccount(newUser, callback) {
  const user = new User(newUser);
  return new Promise((resolve, reject) => {
    user.save((err, user) => {
      if (err) return reject(determineCreateAccountError(err));
      else if (user) {
        return resolve(cleanUser(user));
      }
      reject({message: 'Unexpected outcome. Reason unknown.', problems: { unknown: true }});
    });
  });
}

function cleanUser(user) {
  const { _id, username, email, jobs } = user;
  return { _id, username, email, jobs };
}

function determineCreateAccountError(err) {
  const { code, errors } = err;
  if (code === 11000) {
    if (err.errmsg.indexOf('username') > -1) return {
      message: 'That username is unavailable.',
      problems: { username: true },
      status: 422
    };
    if (err.errmsg.indexOf('lowercaseEmail') > -1) return {
      message: 'There is already an account for that email address.',
      problems: { email: true },
      status: 422
    };
  }
  if (!errors) {
    return {
      message: 'An unknown problem was encountered.',
      problems: { unknown: true }
    };
  }
  if (errors.password) {
    return {
      message: errors.password.message,
      problems: { password: true },
      status: 422
    };
  }
  if (errors.username) {
    return {
      message: errors.username.message,
      problems: { username: true },
      status: 422
    };
  }
  if (errors.lowercaseEmail) {
    return {
      message: errors.lowercaseEmail.message.replace('lowercaseEmail', 'email'),
      problems: { email: true },
      status: 422
    };
  }
}