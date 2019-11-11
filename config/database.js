module.exports.connect = function(cb) {
  const mongoose = require('mongoose');

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/timeclock';
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

  const db = mongoose.connection;
  db.on('error', () => console.error('Error connecting to MongoDB.'));
  db.once('open', () => {
    console.log('Database connection was successful');
    if (cb) cb();
  });
}