const User = require('../models/User');

function createAccount(newUser, callback) {
  const user = new User(newUser);
  return new Promise((resolve, reject) => {
    user.save((err, user) => {
      console.log('CREATE USER-----------------------------------\nerror:');
      console.log(err);
      console.log('-----\nnew user:')
      console.log(user);
      if (err) return callback({
        success: false,
        message: err.code === 11000 ? 'Username or email taken' : 'Unknown server error.',
        problems: err.code === 11000 ? { username: true, email: true } : {}
      });
      else if (user) {
        const { username, email, jobs } = user;
        return resolve({ username, email, jobs });
      }
      reject({message: 'Unexpected outcome. Reason unknown.', problems: {}});
    });
  });
}

module.exports = {
  createAccount: newUser => new Promise((resolve, reject) => {
    const { email, username, password } = newUser;
    if (!username && !email) {
      return reject({
        message: 'You must supply a username or email address.',
        problems: { username: true, email: true }
      });
    }
    if (!password) {
      return reject({
        message: 'You must supply a password.',
        problems: { password: true }
      });
    }
    createAccount({ email, username, password })
  })
}