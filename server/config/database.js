const mongoose = require('mongoose');

const MONGODB_URI = getAtlasDbUri(process.env) || 'mongodb://localhost/timeclock';

module.exports = new Promise(function (resolve, reject) {

  // source: https://github.com/Automattic/mongoose/issues/6578#issuecomment-396789872
  mongoose.plugin(schema => {
    schema.pre('findOneAndUpdate', setRunValidators);
    schema.pre('updateMany', setRunValidators);
    schema.pre('updateOne', setRunValidators);
    schema.pre('update', setRunValidators);
  });

  mongoose.connect(
    MONGODB_URI,
    { useNewUrlParser: true, autoIndex: false, useFindAndModify: false }
  );
  
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

// source: https://github.com/Automattic/mongoose/issues/6578#issuecomment-396789872
function setRunValidators () {
  this.setOptions({ runValidators: true });
}

function getAtlasDbUri(dbInfo) {
  const { DB_NAME, DB_USER, DB_PASSWORD } = dbInfo;
  if (!DB_USER) return;
  return (
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.htin5.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
  );
}