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
  ;

var sections = {
  'consultation-services': require(__dirname + '/sections/consultation-services.yml'),
  'expenses': require(__dirname + '/sections/expenses.yml'),
  'terms-of-agreement': require(__dirname + '/sections/terms-of-agreement.yml')
};

var convertSection = function(s) {
  var combos = {};
  var vars = s.match(/{{.*?}}/g);
  for (var i in vars) {
    combos[vars[i]] = true;
  }
  for (var i in combos) {
    combos[i] = i.substr(2, i.length - 4).split('|');
  }
  for (var i in combos) {
    var e = 'span', t = '';
    if (combos[i][2] && combos[i][2] === 'multi') (e = 'div');
    t = '<' + e + ' class="var" data-var="' + combos[i][0] + '">' + (combos[i][1] || '') + '</' + e + '>';
    i = i.replace(/\|/g, '\\|').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
    s = s.replace(eval('/' + i + '/g'), t);
  }
  return s;
};

var app = express();

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

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  res.render('app', {
    sections: sections,
    convertSection: convertSection
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

phantom.create(function(ph) {
  ph.createPage(function(page) {
    page.open("http://localhost:3333", function(status) {
        page.render('test.pdf', function(){
          console.log('Page Rendered');
          ph.exit();
        });
    });
  });
});