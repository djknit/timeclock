const mongoose = require('mongoose');

const MONGODB_URI = getAtlasDbUri(process.env) || 'mongodb://127.0.0.1:27017';

module.exports = new Promise(function (resolve, reject) {

  // source: https://github.com/Automattic/mongoose/issues/6578#issuecomment-396789872
  mongoose.plugin(schema => {
    schema.pre('findOneAndUpdate', setRunValidators);
    schema.pre('updateMany', setRunValidators);
    schema.pre('updateOne', setRunValidators);
    schema.pre('update', setRunValidators);
  });

  try {
    mongoose.connect(
      MONGODB_URI,
      { useNewUrlParser: true, autoIndex: false, useFindAndModify: false }
    );
  } catch(e) {
    console.log('DB connection failed > --');
    console.error(e);
    console.log('-- DB connection failed />');
  }
  
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
  const { DB_NAME, DB_USER, DB_PASSWORD, DB_CONNECTION_STRING } = dbInfo;
  if (DB_CONNECTION_STRING) {
    return DB_CONNECTION_STRING;
  }
  if (!DB_USER) return;
  return (
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.htin5.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
  );
}