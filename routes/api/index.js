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

module.exports = router;