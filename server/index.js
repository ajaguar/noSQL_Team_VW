'use strict';

var express = require('express');
var config = require('../config');
var fs = require('fs');
var multer = require('multer');
var elasticsearch = require('elasticsearch');
var app = express();
var upload = multer({
    dest: config.uploadDir
});
var esClient = new elasticsearch.Client({
    host: config.elasticSearchHost,
    log: 'trace'
});


app.use(express.static(__dirname + '/../client'));
// serve files from ../../bower_components as static content at /bower_components
app.use('/bower_components', express.static(__dirname + '../../bower_components'));

app.post('/document', upload.single('document'), function (req, res) {
    fs.readFile(req.file.path, 'utf-8', function (err, data) {
        if (err) {
            throw err;
        }
        console.log(req.file);
        console.log(data);
        esClient.create({
            'index': 'file',
            'type': 'document',
            'body': {
                'title': req.file.name,
                'content': data,
                'published_at': new Date()
            }
        }, function (error, response) {
            if (error) {
                throw error;
            }
            fs.unlink(req.file.path, function (err) {
                if (err) {
                    throw err;
                }
            });
        });
    });
    res.send('yes!');
});

app.get('/document', function (req, res) {
    var search = req.query.search;
    if (!search) {
        throw 'no search value given';
    }
    esClient.search({
        'body': {
            'query': {
                'match': {
                    'content': search
                }
            }
        },
        'index': 'file',
        'type': 'document'
    }, function (err, response) {
        if (err) {
            throw err;
        }
        res.send(response);
    });
});


initIndexIfNotExists();

var server = app.listen(process.env.npm_package_config_server_port || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

function initIndexIfNotExists() {
    esClient.indices.delete({
        index: 'file'
    }, function () {
        console.log('creating index');
        esClient.indices.create({
            index: 'file'
        }, function () {
            esClient.indices.putMapping({
                'body': {
                    'properties': {
                        'title': {
                            'type': 'string'
                        },
                        'content': {
                            'type': 'string'
                        },
                        'published_at': {
                            'type': 'date'
                        }
                    }
                },
                'index': 'file',
                'type': 'document'
            });
        });
    });
}
