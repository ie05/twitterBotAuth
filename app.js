var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('express-flash');
var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);

var hbs = require('express-handlebars');
var index = require('./routes/index');
var about = require('./routes/about');
var users = require('./routes/users');
var hbshelpsers = require('./hbshelpers/helpers');
var auth = require('./routes/auth');


var app = express();

// view engine setup
app.engine('.hbs', hbs({
  extname:'.hbs',
  defaultLayout: 'layout',
  helpers: hbshelpsers,
  partialsDor: path.join(__dirname, 'views/partials')
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
secret: '5F9C37F5CDAE59EAE7AB88A48DEBB53F',
resave: true,
saveUninitialized: true
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var mongo_pw = process.env.MONGO_PW;
var url = 'mongodb://secretuser:pw123@ds137271.mlab.com:37271/botsecret';
var session_url = 'mongodb://secretuser:' + mongo_pw + '@localhost:27017/secret?authSource=secret';
mongoose.connect(url);

app.use('/auth', auth);  // Order matters.
app.use('/', index);
app.use('/about', about);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
