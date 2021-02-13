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
require('./passport').middleware.forEach(midWare => app.use(midWare));

// Error handler middleware
app.use(require('../utilities').errorHandlerMiddleware);

// ----------------------

module.exports = {
  addRoutes(router) {
    app.use(router);
  },
  start() {
    app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
  }
};
