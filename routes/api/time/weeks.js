const router = require('express').Router();


const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

router.get(
  '/create-by-date',
  verifyLogin,
  (req, res) => {

  }
);

router.get(
  '/create-by-date',
  verifyLogin,
  (req, res) => {
    
  }
);

module.exports = router;