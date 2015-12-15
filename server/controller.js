'use strict';

module.exports = function (app) {

    var config = require('../config');
    var fs = require('fs');
    var multer = require('multer');
    var elasticsearch = require('elasticsearch');

    var upload = multer({
        dest: config.uploadDir
    });

    var esClient = new elasticsearch.Client({
        host: config.elasticSearchHost,
        log: 'trace'
    });

    initIndexIfNotExists();

    app.post('/document', upload.single('document'), function (req, res) {
        console.log(req.file);
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
                    'title': req.file.originalname,
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
            res.status(400).send('no search value sent');
        } else {
            esClient.search({
                'body': {
                    'query': {
                        'bool': {
                            should: [
                                {
                                    'match': {
                                        'content': search
                                    }
                                },
                                {
                                    'wildcard': {
                                        'title': '*'+search+'*'
                                    }
                                }
                            ]
                        }

                    },
                    'highlight': {
                        'fields': {
                            'content': {
                                'fragment_size': 50
                            },
                            'title': {
                                fragment_size: 0
                            }
                        }
                    },
                    fields: ['title']
                },
                'index': 'file',
                'type': 'document'
            }, function (err, response) {
                if (err) {
                    throw err;
                }
                res.send(response.hits);
            });
        }
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
                                'type': 'string',
                                'index': 'not_analyzed'
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

}