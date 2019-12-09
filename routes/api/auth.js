const { passport } = require('../../config/passport');

const router = require('express').Router();

const UserController = require('../../controllers/User');

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

router.post(
  '/create-account',
  (req, res) => {
    const { password, username, email } = req.body;
    let hasProblem = false;
    let problems = {};
    let problemMessages = [];
    if (typeof(password) !== 'string') {
      hasProblem = true;
      problems.password = true;
      problemMessages.push('You must create a password.');
    }
    if (typeof(username) !== 'string' && typeof(email) !== 'string') {
      hasProblem = true;
      problems.username = true;
      problems.email = true;
      problemMessages.push('You must create a username or provide an email address.')
    };
    if (hasProblem) {
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
  console.log('fuck nuggets')
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
    if (!password) res.status(400).json({
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
      res.json(result)
    })
    .catch(routeErrorHandlerFactory(res));
  }
);

router.post(
  'edit-info',
  verifyLogin,
  (req, res) => {
    const { oldPassword, password, username, email } = req.body;
    const isMissingOldPassword = !oldPassword;
    const isMissingProps = !password && !username && !email;
    if (isMissingOldPassword || isMissingProps) {
      const message = (
        isMissingOldPassword ? 'You must provide your current password.' : '' +
        isMissingOldPassword && isMissingProps ? ' ' : '' +
        isMissingProps ? 'No valid account info properties provided.' : ''
      );
      return res.status(400).json({
        message,
        problems: {
          missingProps: isMissingProps,
          missingPassword: isMissingOldPassword
        }
      });
    }
    const { user } = req;
    user.comparePassword(oldPassword)
    .then(({ isMatch }) => {
      if (isMatch) {
        return UserController.editAccountInfo({ password, username, email });
      }
      else throw {
        message: 'Invalid password.',
        problems: { password: true },
        status: 401
      };
    })
    .then()
    .catch(routeErrorHandlerFactory(res));
  }
);

module.exports = router;

function routeErrorHandlerFactory(responseObj) {
  return err => {
    responseObj.status(err && err.status || 500).json({
      message: err && err.message || 'An unknown error has occurred.',
      problems: err && err.problems || {}
    });
  };
}

function cleanUser(user, propsToKeep) {
  const { username, email } = user;
  return { username, email };
}