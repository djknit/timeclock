const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const UserController = require('../controllers/User');

passport.use(new LocalStrategy(
  {
    usernameField: 'usernameOrEmail'
  },
  function verify(usernameOrEmail, password, done) {
    UserController.findByUsernameOrEmail(usernameOrEmail)
    .catch(err => {
      done(null, false, { message: err.message });
    })
    .then(user => {
      if (!user) {
        return done(null, false, { message: 'user' });
      }
      console.log('hit aA')
      return user.comparePassword(password);
    })
    .then(({ user, isMatch }) => {
      if (isMatch) {
        const { _id, username, email } = user;
        return done(null, { _id, username, email });
      }
      else return done(null, false, { message: 'password' });
    })
    .catch(err => done(null, false, { message: 'password' }));
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