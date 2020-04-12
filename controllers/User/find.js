const { models } = require('./utilities');
const { User } = models;

module.exports = {
  findById,
  findByUsernameOrEmail
};

function findById(id) {
  return new Promise((resolve, reject) => {
    User.findById(id)
    .then(user => {
      if (!user) throw new Error('User not found by ID.');
      resolve(user);
    })
    .catch(reject);
  });
}


function findByUsernameOrEmail(usernameOrEmail) {
  return new Promise((resolve, reject) => {
    if (typeof(usernameOrEmail) !== 'string') {
      throw new Error('Bad query type.');
    }
    else {
      User.findOne({ username: usernameOrEmail })
      .then(user => {
        if (user) return user;
        else return User.findOne({ lowercaseEmail: usernameOrEmail.toLowerCase() });
      })
      .then(user => {
        if (!user) return reject({ message: 'user' });
        resolve(user);
      })
      .catch(reject);
    }
  });
}