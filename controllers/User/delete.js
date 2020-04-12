const { models } = require('./utilities');
const { User } = models;

module.exports = {
  deleteAccount
};

function deleteAccount(id) {
  return new Promise((resolve, reject) => {
    User.findByIdAndDelete(id)
    .then(result => {
      if (result === null) {
        throw new Error('User not found by ID.');
      }
      else if (result._id) {
        return resolve({ success: true });
      }
      throw new Error('An unknown error was encountered.');
    })
    .catch(reject);
  });
}