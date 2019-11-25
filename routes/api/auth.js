const { passport } = require('../../config/passport');

const router = require('express').Router();

const UserController = require('../../controllers/User');

router.get(
  '/test',
  require('connect-ensure-login').ensureLoggedIn('/api/auth/fail'),
  (req, res) => {
    res.json({
      message: 'You are logged in',
      user: cleanUser(req.user)
    });
  }
);

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
      console.log('\n\nCATCH create route\n\n')
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

module.exports = router;

function cleanUser(user, propsToKeep) {
  if (!propsToKeep) propsToKeep = {};
  const { username, email, jobs, _id } = user;
  if (propsToKeep.username === false) username = undefined;
  if (propsToKeep.email === false) email = undefined;
  if (propsToKeep.jobs === false) jobs = undefined;
  if (propsToKeep._id !== true) _id = undefined;
  return { username, email, jobs, _id };
}