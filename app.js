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

app.get('/print', function(req, res) {
  /*
   * @todo (important) - find an unused port! there is a stackoverflow thing about this.
   */
  phantom.create({ port: 1623, binary: config.phantomjs.binary }, function(ph) {
    ph.createPage(function(page) {
      page.set('paperSize', { format: 'A', orientation: 'portrait', border: '.5in' }, function (result) {
        page.open("http://localhost:3000/", function(status) {
          page.render('temp.pdf', function() {
            ph.exit();
            res.type('pdf').send(fs.readFileSync('temp.pdf'));
          });
        });
      });
    });
  });
});

app.post('/print', function(req, res) {

  req.body = {
    sections: ['text', 'text', 'text'],
    vars: {
      'title': 'test',
      'contractor': 'Imaginary, LLC',
      'contractor-address': 'Blah blah\nblahblah',
      'company-signor': 'Matt Tomasulo, CEO',
      'company': 'Walk [Your City]',
      'company-address': 'Blah blah\nblahblah'
    }
  };

  res.render()

});

// app.get('/test.pdf', function(req, res) {
//   res.type('pdf');
//   var wkhtml = require('node-wkhtml');
//   wkhtml
//     .spawn('pdf', 'http://localhost:3000')
//     .stdout.pipe(res);
// });

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});