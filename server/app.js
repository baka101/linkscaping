var express = require('express');
var Promise = require('bluebird');
var path = require('path');
var bodyParser = require('body-parser');
var utils = require('./utils');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));

////////////////////
//SERVE STATIC FILES
////////////////////
var appPath = path.join(__dirname, '../client')
app.use(express.static(appPath));

///////////////////
//RESTFUL REQUESTS
///////////////////
app.post('/check', function (request, response) {
  console.log('Handling POST request at /check')
  console.log('Request body: ', request.body);
  var data = request.body;

  utils.getLinksInfo(data.uri, function (err, result) {
    var linksArray = result.links;
    var urlInfoArray = [];

    var getUrlInfo = function (element) {
      return new Promise(function (resolve, reject) {
        utils.getUrlInfo(element, function (err, urlInfo) {
          if (err) {reject(err);}
          else {
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
        result.links = allLinksInfo;
        // console.log('Array of links: ', result.links);
        io.emit('status', 'done fetching');
        response.send(200, result);
      });

  });

});

///////////////////////////////
// SOCKET.IO REQUESTS
//////////////////////////////
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('request', function(msg){
    console.log('Request from: ' + msg);
  });

});

http.listen(8080, function () {
  console.log('Linkscaping app started:  listening on 8080');
});