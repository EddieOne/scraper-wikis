var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var http = require('http');
var https = require('https');
var sleep = require('system-sleep');
var CronJob = require('cron').CronJob;

var links = {};

var options = {
  methods: 'GET',
  headers: {
    'User-Agent': 'MYDOMAIN.com MyGreatProject',
    'Accept': '/',
    'Connection': 'keep-alive',
  }
}

var h = fs.readFileSync('source.html', 'utf8');
const $ = cheerio.load(h);
$('a').each(function() {
  var link = $(this).attr('href');
  if (isArticle(link)) {
    links[link] = 1;
    options.uri = 'https://en.wikipedia.org' + link
    request(options, function(err, httpResponse, body) {;
      const $ = cheerio.load(body);
      $('a').each(function() {
        var link = $(this).attr('href');
        if (isArticle(link)) {
          links[link] = 1
          var title = link.split("/wiki/").pop()
          console.log(title)
          options.uri = 'https://en.wikipedia.org/w/api.php?format=json&action=query&' +
            'prop=extracts&explaintext=&titles=' + title
          request(options, function(err, httpResponse, body) {
            try {
              fs.writeFileSync('data/' + title + '.txt', body);
            } catch(e) {
              console.log(e);
            }
          });
        }
        sleep(20);
      });
    });
  sleep(800);
  }
});

function isArticle(link) {
  if (!link) { return false; }
  if (link.search('/wiki') !== 0) { return false; }
  if (link.search('portal') != -1) { return false; }
  if (link.search('Portal') != -1) { return false; }
  if (link.search('Category') != -1) { return false; }
  if (link.search('Special') != -1) { return false; }
  if (link.search(':') != -1) { return false; }
  if (link.search('Main_Page') != -1) { return false; }
  if (link.split("/wiki/").pop().split('/') > 0) { return false; }
  if (links[link]) { return false; }
  return true;
}
