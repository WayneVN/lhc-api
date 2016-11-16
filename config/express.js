const express = require('express');
const glob = require('glob');
let jwt = require('jsonwebtoken');
let _ = require('lodash');
const KEYS = 'cocodevn';
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');
  /* app.use(function (req, res, next) {
   *   const url = req.originalUrl;
   *   if (  url == '/api/v1/login') {
   *     next();
   *   }
   *   else {
   *     next();
   *   }
   * });*/


  /* app.use(favicon(config.root + '/public/img/favicon.ico'));*/
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

 

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    //next(err);
    return res.redirect('/');
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
