const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: emailSubdocFactory(),
  lowercaseEmail: Object.assign(
    emailSubdocFactory(),
    {
      index: {
        unique: true,
        partialFilterExpression: { lowercaseEmail: { $type: 'string' } }
      }
    }
  ),
  username: {
    type: String,
    validate: {
      validator: value => {
        if (value.length < 4) return false;
        return true;
      },
      message: 'Usernames must be at least 4 characters long.'
    },
    index: {
      unique: true,
      partialFilterExpression: { username: { $type: 'string' } }
    }
  },
  password: {
    type: String,
    validate: {
      validator: value => {
        if (value.length < 7) return false;
        return true;
      },
      message: 'Passwords must be at least 7 characters long.'
    },
    required: true
  },
  jobs: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }],
  passwordResetToken: String,
  resetTokenExpiration: Number,
  verifyEmailToken: String,
  verifyEmailTokenExpiration: Number,
  unverifiedEmail: emailSubdocFactory()
});

function emailSubdocFactory() {
  return {
    type: String,
    // from bootcamp week 18 activity 15
    match: [/.+@.+\..+/, 'Please enter a valid e-mail address.']
  };
}

// source (for using Bcryptjs w/ Mongoose): http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
UserSchema.pre('save', function(next) {
  const user = this;
  const SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcryptjs.genSalt(
    SALT_FACTOR,
    function(err, salt) {
      if (err) return next(err);

      bcryptjs.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    }
  );
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcryptjs.compare(
    candidatePassword,
    this.password,
    function(err, isMatch) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      cb(null, isMatch);
    }
  );
};

const User = mongoose.model('User', UserSchema);

module.exports = User;