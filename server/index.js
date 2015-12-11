'use strict';

var express = require('express');
var app = express();

//app.get('/', function (req, res) {
//  res.send('Hello World!');
//});
app.use(express.static(__dirname + '/../client'));


var server = app.listen(process.env.npm_package_config_server_port || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

