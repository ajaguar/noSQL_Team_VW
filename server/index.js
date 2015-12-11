'use strict';

var express = require('express');
var app = express();

// serve files from ../client as static content
app.use(express.static('/client'));
// serve files from ../../bower_components as static content at /bower_components
//app.use('/bower_components', express.static('../../bower_components'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

