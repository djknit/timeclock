require('dotenv').config();

require('./config/database');

require('./models');

require('./config/server').start();

module.exports = {};