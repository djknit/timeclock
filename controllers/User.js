const User = require('../models/User');

module.exports = {
  createAccount: newUser => new Promise(
    (resolve, reject) => {
      const { email, username, password } = newUser;
      if ((!username && !email) || !password) {
        const error = new Error('Missing credentials.');
        reject(error);
        throw error;
      }
      const lowercaseEmail = (typeof(email) === 'string') ? email.toLowerCase() : undefined;
      const processedNewUser = lowercaseEmail ? { lowercaseEmail, ...newUser } : newUser;
      const user = new User(processedNewUser);
      user.save((err, user) => {
        if (err) {
          return reject(determineUserInfoError(err));
        }
        else if (user) {
          return resolve(cleanUser(user));
        }
        const unexpectedErr = new Error('Unexpected outcome. Reason unknown.');
        reject(unexpectedErr);
        throw unexpectedErr;
      });
    }
  ),
  findByUsernameOrEmail: usernameOrEmail => new Promise(
    (resolve, reject) => {
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
          throw new Error('User not found by ID.');
        }
        else if (result._id) {
          return resolve({ success: true });
        }
        throw new Error('An unknown error was encountered.');
      })
      .catch(reject);
    }
  ),
  editAccountInfo: (user, updatedProps) => new Promise(
    (resolve, reject) => {
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
          return resolve(cleanUser(user));
        }
        const unexpectedErr = new Error('Unexpected outcome. Reason unknown.');
        reject(unexpectedErr);
        throw unexpectedErr;
      });
    }
  ),
  checkForJobWithName: (jobName, userId) => new Promise(
    (resolve, reject) => {
      User.findById(userId)
      .populate('jobs')
      .then(user => {
        // console.log(user)
        if (user.jobs.map(job => job.name).filter(name => name === jobName).length > 0) {
          return reject({
            message: 'You already have a job with that name. You must give each job a unique name.',
            problems: {
              name: true
            },
            status: 422
          });
        }
        resolve();
      });
    }
  ),
  addJob: (jobId, userId) => new Promise(
    (resolve, reject) => {
      User.findByIdAndUpdate(
        userId,
        {
          $push: {
            jobs: jobId
          }
        },
        { new: true }
      )
      .populate({
        path: 'jobs',
        populate: 'weeks.data.document'
      })
      .then(resolve)
      .catch(reject);
    }
  )
};

function cleanUser(user) {
  const { _id, username, email, jobs } = user;
  return { _id, username, email, jobs };
}

function determineUserInfoError(err) {
  const { code, errors, errmsg } = err;
  let problemMessages = [];
  let problems = {};
  let status;
  if (code === 11000) {
    if (errmsg.indexOf('username') > -1) {
      return {
        message: 'That username is unavailable.',
        problems: { username: true },
        status: 422
      };
    }
    if (errmsg.indexOf('lowercaseEmail') > -1) {
      return {
        message: 'There is already an account for that email address.',
        problems: { email: true },
        status: 422
      };
    }
  }
  if (!errors) {
    return new Error('An unknown problem was encountered.');
  }
  if (errors.password) {
    problemMessages.push(errors.password.message);
    problems.password = true;
    status = 422;
  }
  if (errors.username) {
    problemMessages.push(errors.username.message);
    problems.username = true;
    status = 422;
  }
  if (errors.lowercaseEmail) {
    problemMessages.push(errors.lowercaseEmail.message.replace('lowercaseEmail', 'email'));
    problems.email = true;
    status = 422;
  }
  if (problemMessages.length > 0) {
    return {
      messages: problemMessages,
      problems,
      status
    };
  }
  return new Error('An unknown problem was encountered.');
}