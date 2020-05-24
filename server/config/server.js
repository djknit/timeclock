// Create express app and passport instances
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

// Add Middleware -------

// General middleware
app.use(express.static('client/build'));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(require('morgan')('combined')); // logs http requests

// Additional middleware needed for Passport
const { middleware } = require('./passport.js');
middleware.forEach(middleware_ => app.use(middleware_));

// Error handler middleware
app.use(require('../utilities').errorHandlerMiddleware);

// ----------------------

const router = require('../routes');
app.use(router);

function startServer() {
  app.listen(
    PORT,
    () => console.log('Server listening on PORT: ' + PORT)
  );
}

module.exports = {
  start: startServer
};