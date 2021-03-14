const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User: UserController } = require('../controllers');

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
    .then(({ _id, username, email, jobs }) => {
      done(null, { _id, username, email, jobs });
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
    secret: process.env.CONNECT_SESSION_SECRET || 'super-secret',
    resave: false,
    saveUninitialized: false,
    maxAge: 240000
  }),
  passport.initialize(), // required before `passport.session()`
  passport.session(), // deserializes `req.user`. (source: https://stackoverflow.com/questions/46644366/what-is-passport-initialize-nodejs-express#answers )
];

module.exports = {
  passport,
  middleware
}
