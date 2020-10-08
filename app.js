const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dontenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

// Load config
dontenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);
const { ensureAuth } = require('./middleware/auth.js');

// Database
connectDB();

// routes
const index = require('./routes/index');
const login = require('./routes/login');
const admin = require('./routes/admin');

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  select,
  trim,
} = require('./helpers/hbs');

// Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: { formatDate, stripTags, truncate, select, trim },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

// Sessions
app.use(
  session({
    secret: `${process.env.MY_SESSION_SECRET}`,
    key: `${process.env.MY_SESSION_KEY}`,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.info_msg = req.flash('info_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(fileUpload());

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/cc-login', login);
app.use('/admin', ensureAuth, admin);

app.get('*', (req, res) => {
  res.render('error/404', {
    layout: 'error',
  });
});

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
