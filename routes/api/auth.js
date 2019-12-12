const { passport } = require('../../config/passport');

const router = require('express').Router();

const UserController = require('../../controllers/User');

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

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
        message: problemMessages.join(' '),
        problems
      });
    }
    UserController.createAccount(req.body)
    .then(result => {
      req.login(
        { password, ...result },
        err => {
          if (err) return res.status(500).json(err);
          res.json(cleanUser(req.user));
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
  let response = {};
  const message = req.flash();
  console.log(message);
  console.log('chicken nuggets')
  if (message.error && message.error[0] === 'Missing credentials') {
    return res.status(400).json({
      message: 'Missing or improperly formatted credentials.',
      problems: { unknown: true }
    });
  }
  if (message.error && message.error[0] === 'user') {
    response = {
      message: 'Username or email address not found.',
      problems: { usernameOrEmail: true }
    }
  }
  else if (message.error && message.error[0] === 'password') {
    response = {
      message: 'Incorrect password.',
      problems: { password: true }
    }
  }
  else {
    response = {
      message: 'You are not authenticated.',
      problems: { unknown: true }
    }
  }
  res.status(401).json(response);
});

router.post(
  '/logout',
  verifyLogin,
  (req, res) => {
    req.logout();
    res.json({
      success: true,
      message: 'Account logout was successful.'
    });
  }
);

router.get(
  '/test',
  verifyLogin,
  (req, res) => {
    const { user } = req;
    if (user) {
      res.json({
        message: 'You are logged in.',
        user: cleanUser(user)
      });
    }
    else {
      res.status(401).json({ message: 'User not found.'});
    }
  }
);

router.post(
  '/delete-account',
  verifyLogin,
  (req, res) => {
    const { password } = req.body;
    if (typeof(password) !== 'string') res.status(400).json({
      message: 'You must enter your password.',
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
        success: true,
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
    console.log('WTF IS GOING ON')
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
    else if (password === null) {
      problems.updatedProps.password = true;
      problemMessages.push('Password cannot be set to null.');
    }
    if (username === null && email === null) {
      problems.updatedProps.username = true;
      problems.updatedProps.email = true;
      problemMessages.push('You must have a username or email address; they cannot both be null at the same time.');
    }
    if (problemMessages.length > 0) {
      return res.status(400).json({
        message: problemMessages.join(' '),
        problems
      });
    }
    const { user } = req;
    user.comparePassword(oldPassword)
    .then(({ isMatch }) => {
      if (isMatch) {
        return UserController.editAccountInfo(user, { username, email, password });
      }
      else throw {
        message: 'Invalid password.',
        problems: { password: true },
        status: 401
      };
    })
    .then(result => {
      console.log(result)
      console.log('. '.repeat(30))
      res.json(result)
    })
    .catch(routeErrorHandlerFactory(res));
  }
);

module.exports = router;

function routeErrorHandlerFactory(responseObj) {
  return err => {
    if (!err) {
      console.log('No error object in routeErrorHandler. Unknown error.');
      err = { message: 'Unknown error.' };
    }
    if (!err.status) err.status = 500;
    if (!err.message) err.message = 'An unknown error has occurred.';
    responseObj.status(err.status).json({
      message: err.message,
      problems: err.problems || { unknown: true }
    });
    if (err.status === 500) throw err;
  };
}

function cleanUser(user, propsToKeep) {
  const { username, email } = user;
  return { username, email };
}