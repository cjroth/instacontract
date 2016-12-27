var express = require('express');
var app = require('express')();
var fs = require('fs');
var jsyaml = require('js-yaml');
var config = require('./config.yml');
var ejs = require('ejs');
var mongodb = require('mongodb');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

var http = require('http').createServer(app);

var get, put;

var MongoClient = mongodb.MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017/widget', function(err, db) {

  if (err) throw err;
  var collection = db.collection('widget');

  // this causes duplicate error. i'm not sure why, it should work, but it doesn't.
  // collection.ensureIndex( { 'api-key': 1 }, { unique: true }, function(err) {
  //   if (err) throw err;
  // });

  get = function(apikey, callback) {
    console.log('get', apikey);
    return collection.findOne({ 'api-key': apikey }, function(err, document) {
      if (err) throw err;
      callback && callback(document);
    });
  };

  put = function(apikey, data) {
    console.log('put', apikey, data);
    return collection.update({ 'api-key': apikey }, { $set: data }, { upsert: true }, function(err) {
      if (err) throw err;
    });
  };

});

app.configure(function() {
  app.use(express.static(__dirname + '/dist'));
  app.use(express.bodyParser());
  app.set('view engine', 'ejs');
});

app.get('/', function (req, res) {
  var apikey = req.query['api-key'];
  if (apikey) {
    get(apikey, function(data) {
      res.render('widget', { config: data, apikey: apikey });
    });
  } else {
    res.render('widget', { config: {}, apikey: '' });
  }
});

app.get('/get', function(req, res) {
  var apikey = req.query['api-key'];
  if (!apikey) return res.send(400, 'No API key provided.');
  get(apikey, function(data) {
    return res.json(data);
  });
});

app.post('/put', function(req, res) {
  var apikey = req.body['api-key'];
  var data = req.body['data'];
  if (!apikey) return res.send(400, 'No API key provided.');
  if (!data) return res.send(400, 'No config settings provided.');
  put(apikey, data);
  return res.send(200);
});

http.listen(config['http-port'] || 8080);
