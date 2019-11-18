const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/timeclock';

module.exports = new Promise(function (resolve, reject) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

  const db = mongoose.connection;
  db.on('error', function() {
    console.error('Error connecting to MongoDB.');
    reject();
  });
  db.once('open', function() {
    console.log('Database connection was successful');
    resolve();
  });
});