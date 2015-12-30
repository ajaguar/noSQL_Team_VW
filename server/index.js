'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var elasticsearch = require('elasticsearch');
var config = require('../config');
var esClient = new elasticsearch.Client({
    host: config.elasticSearchHost,
    log: 'trace'
});
var socket = require('./socket')(http, esClient);
require('./controller')(app, esClient, socket);

app.use(express.static(__dirname + '/../client'));
app.use('/bower_components', express.static(__dirname + '../../bower_components'));

http.listen(process.env.npm_package_config_server_port || 3000, function () {
    var host = http.address().address;
    var port = http.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});