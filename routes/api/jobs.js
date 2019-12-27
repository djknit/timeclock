const router = require('express').Router();

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

const JobController = require('../../controllers/Job');

router.post(
  verifyLogin,
  (req, res) => {

  }
);

module.exports = router;