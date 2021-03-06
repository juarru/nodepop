'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// Loading Database connection with mongoose
require('./lib/mongooseConn');

// Loading Models
require('./models/Commercial');
require('./models/User');
require('./models/Token');

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

// Detecting languaje in header with x-lang
app.use((req, res, next) => {
  req.lang = req.get('x-lang') || 'en';
  next();
});

//app.use('/', routes);
//app.use('/users', users);

// Index route
app.use('/', require('./routes/index'));

// Loading API routes
app.use('/api/v1/commercials', require('./routes/api/v1/commercials'));
app.use('/api/v1/users', require('./routes/api/v1/users'));
app.use('/api/v1/tokens', require('./routes/api/v1/tokens'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
