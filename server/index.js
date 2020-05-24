require('dotenv').config();

require('./config/database');

require('./models');

require('./config/server').start();

const shared = require('../shared');
console.log(shared.testValue);

module.exports = {};