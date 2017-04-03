var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var fs = require('fs');
var formidable = require('formidable');



var config = require('./config');
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
var graphic = require('./routes/graphic');
var data = require('./routes/data');


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



/*app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods',"GET,PUT,POST,DELETE");
    res.header('Access-Control-Allow-Headers', "Authorization");
    next();
});*/

app.use(cors());

app.use(session({secret: config.secret, cookie: { maxAge: 2628000000 }, resave: true, saveUninitialized: true}));

app.get('/',function (req, res) {
    res.redirect('/admin');
});

app.use('/admin', login);
app.use('/log-in', log_in);
app.use('/api', api);


app.get('/recoverpw', function (req,res) {
    res.render('recoverpw');
});

app.get('/register', function (req,res) {
    res.render('register');
});

//verificar session iniciada
app.use(function (req,res,next) {
    const session = req.session;
    if (session.remember){
        if (session.remember === false){
            //sesion cerrada
            res.redirect('admin');
        }else{
            //session iniciada
            next();
        }
    }else{
        res.redirect('admin');
    }
});


app.use('/index', index);
app.use('/sensor', sensor);
app.use('/alert', alert);
app.use('/historical', historical);
app.use('/settings', settings);
app.use('/profile', profile);
app.use('/log-out', log_out);
app.use('/graphic', graphic);
app.use('/data', data);
app.use('/network',net);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
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
