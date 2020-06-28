const { passport } = require('../../config/passport');

const router = require('express').Router();

const UserController = require('../../controllers/User');

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

const { routeErrorHandlerFactory, cleanUser } = require('./utilities');

router.post(
  '/create-account',
  (req, res) => {
    const { password, username, email } = req.body;
    let problems = {};
    let problemMessages = [];
    if (typeof(password) !== 'string') {
      problems.password = true;
      problemMessages.push('You must create a password.');
    }
    if (typeof(username) !== 'string' && typeof(email) !== 'string') {
      problems.username = true;
      problems.email = true;
      problemMessages.push('You must create a username or provide an email address.')
    };
    if (problemMessages.length > 0) {
      return res.status(400).json({
        messages: problemMessages,
        problems
      });
    }
    UserController.createAccount(req.body)
    .then(result => {
      req.login(
        result,
        err => {
          if (err) return res.status(500).json(err);
          res.json({
            user: cleanUser(req.user),
            message: 'Account created. You are now logged in to your new account.'
          });
        }
      );
    })
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/login',
  passport.authenticate(
    'local',
    { failureRedirect: '/api/auth/fail', failureFlash: true }
  ),
  (req, res) => {
    res.json({
      message: 'You are now logged in.',
      user: cleanUser(req.user)
    });
  }
);

router.get('/fail', (req, res) => {
  const message = req.flash();
  let messages = [];
  let problems = {};
  if (message.error && message.error[0] === 'Missing credentials') {
    return res.status(400).json({
      messages: ['Missing or improperly formatted credentials.'],
      problems: { unknown: true }
    });
  }
  if (message.error && message.error[0] === 'user') {
    messages.push('Username or email address not found.');
    problems.usernameOrEmail = true;
  }
  else if (message.error && message.error[0] === 'password') {
    messages.push('Incorrect password.');
    problems.password= true;
  }
  else {
    messages.push('You are not authenticated.');
    problems.unknown = true
  }
  res.status(401).json({ messages, problems });
});

router.post(
  '/logout',
  verifyLogin,
  (req, res) => {
    req.logout();
    res.json({
      message: 'Account logout was successful.'
    });
  }
);

router.get(
  '/test',
  verifyLogin,
  (req, res) => {
    UserController.getWithJobBasics(req.user._id)
    .then(user => {
      res.json({
        message: 'You are logged in.',
        user: cleanUser(user)
      });
    })
    .catch(() => res.status(401).json({ messages: ['User not found.'] }));
  }
);

router.post(
  '/delete-account',
  verifyLogin,
  (req, res) => {
    const { password } = req.body;
    if (typeof(password) !== 'string') res.status(400).json({
      messages: ['You must enter your password.'],
      problems: {
        password: true
      }
    });
    const { user } = req;
    user.comparePassword(password)
    .then(({ isMatch }) => {
      if (isMatch) return UserController.deleteAccount(user._id);
      else throw {
        message: 'Invalid password.',
        problems: { password: true },
        status: 401
      };
    })
    .then(result => {
      if (result.success) return res.json({
        message: 'Your account was successfully deleted.'
      });
    })
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  '/edit-info',
  verifyLogin,
  (req, res) => {
    const oldPassword = req.body.password;
    const { password, email, username } = req.body.updatedProps || {};
    let problems = { updatedProps: {} };
    let problemMessages = [];
    if (typeof(oldPassword) !== 'string') {
      problems.password = true;
      problemMessages.push('You must provide your current password.');
    }
    const hasUsername = username === null || typeof(username) === 'string';
    const hasEmail = email === null || typeof(email) === 'string';
    const hasPassword = typeof(password) === 'string';
    if (!hasUsername && !hasEmail && !hasPassword) {
      problems.updatedProps.password = true;
      problems.updatedProps.username = true;
      problems.updatedProps.email = true;
      problemMessages.push('No valid account info properties provided.');
    }
    if (password === null) {
      problems.updatedProps.password = true;
      problemMessages.push('Password cannot be set to null.');
    }
    const { user } = req;
    if (
      (username === null && email === null) ||
      (username === null && !user.email) ||
      (!user.username && email === null)
    ) {
      problems.updatedProps.username = true;
      problems.updatedProps.email = true;
      problemMessages.push('You must have a username or email address; they cannot both be null at the same time.');
    }
    if (problemMessages.length > 0) {
      return res.status(400).json({
        messages: problemMessages,
        problems
      });
    }
    const wrongPasswordMsg = 'Incorrect password.';
    user.comparePassword(oldPassword)
    .then(({ isMatch }) => {
      if (isMatch) {
        return UserController.editAccountInfo(user, { username, email, password });
      }
      else throw {
        message: wrongPasswordMsg,
        problems: { password: true },
        status: 401
      };
    })
    .then(updatedUser => {
      res.json({
        user: cleanUser(updatedUser)
      });
    })
    .catch(err => {
      const _probs = (err && err.problems) || {};
      const isWrongPassword = err && err.message && err.message === wrongPasswordMsg;
      if (_probs.username || _probs.email || (_probs.password && !isWrongPassword)) {
        err.problems = { updatedProps: _probs };
      }
      throw err;
    })
    .catch(routeErrorHandlerFactory(res));
  }
);

module.exports = router;