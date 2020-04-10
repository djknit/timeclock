const router = require('express').Router();

router.post(
  '/clock-in',
  verifyLogin,
  (req, res) => {

  }
);

router.post(
  '/clock-out',
  verifyLogin,
  (req, res) => {
    
  }
);

router.post(
  '/clear',
  verifyLogin,
  (req, res) => {

  }
);

router.post(
  '/confirm-pending-segment',
  verifyLogin,
  (req, res) => {
    
  }
);

router.get(
  '/',
  verifyLogin,
  (req, res) => {

  }
);

module.exports = router;