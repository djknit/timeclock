const router = require('express').Router();

// router.use('/weeks', require('./weeks'));
// router.use('/days', require('./days'));
// router.use('/segments', require('./segments'));

const verifyLogin = require('connect-ensure-login').ensureLoggedIn('/api/auth/fail');

router.post(
  '/add-segment-to-day',
  verifyLogin,
  (req, res) => {
    
  }
);

router.post(
  '/add-segment',
  verifyLogin,
  (req, res) => {
    
  }
);

router.post(
  '/delete-segment',
  verifyLogin,
  (req, res) => {
    
  }
);

module.exports = router;