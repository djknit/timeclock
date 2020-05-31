const router = require('express').Router();

const htmlDocPath = require('../../htmlDocPath');

router.use('/api', require('./api'));

router.get(
  '*',
  (req, res) => {
    res.sendFile(htmlDocPath);
  }
);

module.exports = router;