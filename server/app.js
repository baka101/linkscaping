var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var utils = require('./utils');

var app = express();

// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));


var appPath = path.join(__dirname, '../client')
app.use(express.static(appPath));

app.post('/check', function (request, response) {
  console.log('Handling POST request at /check')
  console.log('Request body: ', request.body);
  var data = request.body;

  utils.getLinksInfo(data.uri, function (err, result) {
    // console.log('Array of links: ', result.links);
    response.send(200, result);
  });

});


console.log('Linkscaping app started:  listening on 8080');
app.listen(8080);