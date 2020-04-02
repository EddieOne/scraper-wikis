var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var http = require('http');
var https = require('https');
var sleep = require('system-sleep');
var CronJob = require('cron').CronJob;
var walk = require('walk');

var walker  = walk.walk('./data', { followLinks: false });

walker.on('file', function(root, stat, next) {
  var data = JSON.parse(fs.readFileSync(root + '/' + stat.name, 'utf8'));
  var page = data.query.pages[Object.keys(data.query.pages)[0]];
  var extract = page.extract.replace(',', '');
  extract = extract.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
  extract = extract.split('== References ==')[0];
  extract = extract.split('== ').join('');;
  extract = extract.split(' ==').join('');
  extract = extract.split('==').join('');
  extract = extract.split('...').join('');
  extract = extract.split('\n').join('');
  extract = extract.split('.').join('');
  extract = extract.split('"').join('');
  extract = extract.split(',').join('');
  extract = extract.split('`').join('');
  extract = extract.toLowerCase();
  fs.appendFileSync('allwords', extract + ' ');
  console.log(page.title)
  next();
});
