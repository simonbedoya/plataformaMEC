var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

var index = require('./routes/index');
var login = require('./routes/login');
var log_in = require('./routes/log-in');
var net = require('./routes/network');
var sensor = require('./routes/sensor');
var alert = require('./routes/alert');
var historical = require('./routes/historical');
var settings = require('./routes/settings');
var profile = require('./routes/profile');
var log_out = require('./routes/log-out');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'abcd1234', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true}));

app.get('/',function (req, res) {
    res.redirect('/admin');
})
app.use('/admin', login);
app.use('/index', index);
app.use('/log-in', log_in);
app.use('/network', net);
app.use('/sensor', sensor);
app.use('/alert', alert);
app.use('/historical', historical);
app.use('/settings', settings);
app.use('/profile', profile);
app.use('/log-out', log_out);
app.use('/api', api);

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
