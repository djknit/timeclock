const User = require('../models/User');

module.exports = {
  createAccount: newUser => new Promise(
    (resolve, reject) => {
      const { email, username, password } = newUser;
      console.log('\nNEW USER TO CREATE\n\n')
      console.log(newUser);
      console.log()
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
      console.log('passed checks round 1')
      const lowercaseEmail = (typeof(email) === 'string') ? email.toLowerCase() : undefined;
      console.log(' 2 2 2')
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
        if (!user) return reject(new Error('User not found by ID.'));
        resolve(user);
      })
      .catch(reject);
    }
  )
}

function _createAccount(newUser, callback) {
  console.log('inside CREATE ACCOUNT ...........');
  const user = new User(newUser);
  return new Promise((resolve, reject) => {
    user.save((err, user) => {
      console.log('CREATE USER-----------------------------------\nerror:');
      console.log(err);
      console.log('-----\nnew user:')
      console.log(user);
      if (err) return reject({
        message: err.code === 11000 ? 'Username or email taken' : 'Unknown server error.',
        problems: err.code === 11000 ? { username: true, email: true } : { unknown: true }
      });
      else if (user) {
        console.log('RESOLVING')
        return resolve(cleanUser(user));
      }
      console.log('RESOLVING')
      reject({message: 'Unexpected outcome. Reason unknown.', problems: { unknown: true }});
    });
  });
}

function cleanUser(user) {
  const { _id, username, email, jobs } = user;
  return { _id, username, email, jobs };
}