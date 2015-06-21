var express = require('express');
var Promise = require('bluebird');
var path = require('path');
var utils = require('./utils');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

////////////////////
//SERVE STATIC FILES
////////////////////
var appPath = path.join(__dirname, '../client')
app.use(express.static(appPath));

///////////////////////////////
// SOCKET.IO REQUESTS
//////////////////////////////
io.on('connection', function(socket){
  console.log('a user connected:', socket.id);

  socket.on('request', function(msg){
    console.log('Request from: ' + msg);
  });

  socket.on('checkStatus', function(uri) {
    console.log('Handling check request for:', uri);

    utils.getLinksInfo(uri, function (err, result) {
      //send event for url status of base url
      socket.emit('urlStatus', {code: result.code, url: result.url, title: result.title});

      //fetch status of links on page
      var linksArray = result.links;
      if (linksArray) {
        var getUrlInfo = function (element) {
          return new Promise(function (resolve, reject) {
            utils.getUrlInfo(element, function (err, urlInfo) {
              if (err) {reject(err);}
              else {
                socket.emit('linkStatus', urlInfo);
                resolve(urlInfo);
              }
            });
          });
        };

        var getLinksInfo = function (array) {
          return Promise.all(array.map(getUrlInfo));
        };
        
        getLinksInfo(linksArray)
          .then(function (allLinksInfo) {
            // result.links = allLinksInfo;
            // console.log('Array of links: ', result.links);
            socket.emit('doneFetching');
          });

      } else {
        socket.emit('doneFetching');
      } // if...else...
    }); //utils.getLinksInfo...
  }); //socket.on('checkStatus'...
}); //io.on('connection'...

var port = process.env.PORT || 8080;
http.listen(port, function () {
  console.log('Linkscaping app started: listening on ', port);
});