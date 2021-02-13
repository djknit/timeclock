require('./database');
const { passport } = require('./passport');
const server = require('./server');

module.exports = {
  server,
  passport
};
