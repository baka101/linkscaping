///////////////////////////////////////////////////////////////////
// NOT USED
// var $ = require('jquery')(require("jsdom").jsdom().parentWindow);
////////////////////////////////////////////////////////////////////
var request = require('request');
var _ = require('underscore');
var cheerio = require('cheerio');
var Promise = require('bluebird');

exports.getUrlInfo = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      var result = {};
      result.title = 'ERROR: failed to connect to URL';
      result.url = url;
      result.code = err.code;
      return cb(null, result);
    } else {
      var match = html.match(/<title>(.*)<\/title>/);
      var result = {};
      result.title = match ? match[1] : url;
      result.url = url;
      result.code = res.statusCode;

      return cb(null, result);
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

// exports.checkLinksStatus = function(linksArray) {

//   return new Promise(function (resolve, reject) {



//   });
// }


// var getUserAvatarWithBluebird = function(user) {
// // Create and return a promise object using the 'new' keyword -> this is special to Bluebird's implementation
// // Promises will be native in ES6 and will use the same syntax as Bluebird
// return new Promise(function(resolve, reject) {

//     github.search.users({ q: user }, function(error, response) {
//     // Whatever is passed into reject gets can be accessed in the 'catch' block's callback function
//     if (error) { reject(error); }
//     else {
//     var avatarUrl = response.items[0].avatar_url;
//     // Pass arguments of interest into resolve
//     // Whatever is passed into resolve gets can be accessed in the 'then' block's callback function
//         resolve(avatarUrl);
//       }
//     });
//   });
// };


//takes in an html document and returns array of unique link urls
var extractLinks = function(html, baseURL) {
  var results = [];

  $ = cheerio.load(html);

  linksArray = $('a');
  // console.log($(link).text() + ':\n  ' + $(link).attr('href'));

  $(linksArray).each(function(i, link){
    // console.log('==============> parsed:', $(link).text() + ' | ' + $(link).attr('href'));

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

    //if it's a relative link (e.g. something that starts with /), add the original url
    if ((urlString[0] === '/') && (urlString[1] !== '/')){
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
