const router = require('express').Router();

router.use('/auth', require('./auth'));

router.get(
  '/test',
  (req, res) => {
    res.json({
      message: 'This is the API speaking. HELO WORLD',
      success: true,
      hello: 'world'
    })
  }
);

router.all(
  '*',
  (req, res) => {
    res.status(404).json({
      message: 'This API route either does not exist or does not allow the HTTP method that you are attempting to use.'
    });
  }
);

module.exports = router;