/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , jsYaml = require('js-yaml')
  , fs = require('fs')
  , ejs = require('ejs')
  , config = require('./config.yml')
  , _ = require('underscore')
  , phantom = require('phantom')
  , querystring = require('querystring')
  , mongodb = require('mongodb')
  , MongoClient = mongodb.MongoClient
  , ObjectID = mongodb.ObjectID
  ;

app.configure(function() {
  app.set('port', process.env.PORT || config.port || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  res.render('simple');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});