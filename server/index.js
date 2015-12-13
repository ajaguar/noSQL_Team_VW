'use strict';

var express = require('express');
var app = express();
var controller = require('./controller')(app);

app.use(express.static(__dirname + '/../client'));
app.use('/bower_components', express.static(__dirname + '../../bower_components'));

var server = app.listen(process.env.npm_package_config_server_port || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});