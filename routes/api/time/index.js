const router = require('express').Router();

router.use('/weeks', require('./weeks'));
router.use('/days', require('./days'));
router.use('/segments', require('./segments'));

module.exports = router;