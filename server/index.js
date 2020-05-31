require('dotenv').config();

require('./config/database');

require('./models');

const server = require('./config/server');

module.exports = server;