require('dotenv').config();

const { start, addRoutes } = require('./config').server;

addRoutes(require('./routes'));

module.exports = {
  start
};
