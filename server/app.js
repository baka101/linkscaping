var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));


var appPath = path.join(__dirname, '../client')
app.use(express.static(appPath));


console.log('Linkscaping app started:  listening on 8080');
app.listen(8080);