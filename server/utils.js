///////////////////////////////////////////////////////////////////
// NOT USED
// var $ = require('jquery')(require("jsdom").jsdom().parentWindow);
////////////////////////////////////////////////////////////////////
var request = require('request');
var _ = require('underscore');
var cheerio = require('cheerio');

exports.getUrlInfo = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      var result = {};
      result.title = 'ERROR: failed to connect to URL';
      result.url = url;
      result.code = err.code;
      return cb(err, result);
    } else {
      var match = html.match(/<title>(.*)<\/title>/);
      var result = {};
      result.title = match ? match[1] : url;
      result.url = url;
      result.code = res.statusCode;

      return cb(err, result);
    }
  });
};

exports.getLinksInfo = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      var result = {};
      result.title = 'ERROR: failed to connect to URL';
      result.url = url;
      result.code = err.code;
      return cb(err, result);
    } else {
      var match = html.match(/<title>(.*)<\/title>/);
      var result = {};
      result.title = match ? match[1] : url;
      result.url = url;
      result.code = res.statusCode;

      // console.log(html);
      // console.log('==================ARRAY OF LINKS===============');
      result.links = extractLinks(html, url);
      // console.log(result.links);

      return cb(err, result);
    }
  });
}

//takes in an html document and returns array of unique links
var extractLinks = function(html, baseURL) {
  var results = [];

  $ = cheerio.load(html);

  linksArray = $('a');
  // console.log($(link).text() + ':\n  ' + $(link).attr('href'));

  $(linksArray).each(function(i, link){
    console.log('==============> parsed:', $(link).text() + ' | ' + $(link).attr('href'));

    var urlString = $(link).attr('href');

    //if it's undefined and falsy, return and don't push to results
    if (!urlString) {
      console.log('NOT ADDING:', urlString);
      return;
    }

    //take out query parameters from the url (everything after a question mark)
    if (urlString.indexOf('?') !== -1) {
      urlString = urlString.substring(0, urlString.indexOf('?'));
    }

    //if it's a relative link, add the original url
    if (urlString[0] === '/') {
      urlString = baseURL + urlString;
    }
    
    //if it's an http url, add it to results
    if (urlString.slice(0, 4) === 'http'){
      // console.log('ADDING: ', urlString);
      results.push(urlString);
    }
  });

  //take only unique values
  return _.uniq(results);

  ///////////////////////////////////////////////////////////////////
  // OLD CODE USING REGEX
  // //grab all the <a> </a> tags
  // var linksStr = html.match(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g);
  
  // //go through array and grab just the URL elements
  // linksStr.forEach(function (item) {
  //   var matched = item.match(/href="([^"]*)"/);
  //   var urlString = matched[1];

  //   //take out query parameters from the url (everything after a question mark)
  //   urlString = urlString.substring(0, urlString.indexOf('?'));

  //   //if it's a relative link, add the original url
  //   if (urlString[0] === '/') {
  //     urlString = baseURL + urlString;
  //   }

  //   results.push(urlString);
  // });

};