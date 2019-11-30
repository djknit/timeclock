const { passport } = require('../../config/passport');

const router = require('express').Router();

const UserController = require('../../controllers/User');

router.post(
  '/create-account',
  (req, res) => {
    const { password } = req.body;
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
    .catch(err => {
      if (!err.problems || err.problems.unknown) res.status(500);
      else res.status(422);
      res.json(err);
    });
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
  res.status(401);
  res.json(response);
});

router.post(
  '/logout',
  require('connect-ensure-login').ensureLoggedIn('/api/auth/fail'),
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
  require('connect-ensure-login').ensureLoggedIn('/api/auth/fail'),
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
  require('connect-ensure-login').ensureLoggedIn('/api/auth/fail'),
  (req, res) => {
    const { password } = req.body;
    const { user } = req;
    user.comparePassword(password)
    .then(({ isMatch }) => {
      if (isMatch) return UserController.deleteAccount(user._id);
      throw new Error('An unknown error has occurred.');
    })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json({
        message: err && err.message || 'An unknown error has occurred.',
        problems: err && err.problems || {}
      });
    });
  }
);

module.exports = router;

function cleanUser(user, propsToKeep) {
  if (!propsToKeep) propsToKeep = { _id: true };
  const { username, email, jobs, _id } = user;
  return {
    username,
    email,
    jobs,
    _id: propsToKeep._id === true ? _id : undefined
  };
}