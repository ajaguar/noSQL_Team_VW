'use strict';

var express = require('express');
var app = express();
var controller = require('./controller')(app);

app.use(express.static(__dirname + '/../client'));
app.use('/bower_components', express.static(__dirname + '../../bower_components'));