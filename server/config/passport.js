const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const UserController = require('../controllers/User');

passport.use(new LocalStrategy(
  {
    usernameField: 'usernameOrEmail'
  },
  function verify(usernameOrEmail, password, done) {
    if (typeof(usernameOrEmail) !== 'string') return  done(null, false, { message: 'user' });
    if (typeof(password) !== 'string') return  done(null, false, { message: 'password' });
    UserController.findByUsernameOrEmail(usernameOrEmail)
    .then(user => {
      if (!user) throw new Error('user');
      return user.comparePassword(password);
    })
    .then(result => {
      if (result && result.isMatch) {
        return UserController.getWithJobBasics(result.user._id);
      }
      else throw new Error('password');
    })
    .then(user => {
      const { _id, username, email, jobs } = user;
      return done(null, { _id, username, email, jobs });
    })
    .catch(err => done(null, false, { message: (err && err.message) || 'unknown' }));
  }
));

// Functions used by Passport to serialize user ID and store in session.
passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((id, done) => {
  UserController.findById(id)
  .then(user => done(null, user))
  .catch(done);
});

const middleware = [
  require('cookie-parser')(),
  require('connect-flash')(),
  require('express-session')({
    secret: process.env.CONNECT_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    maxAge: 240000
  }),
  passport.initialize(),
  passport.session()
];

module.exports = {
  passport,
  middleware
}