'use strict';

module.exports = function (app, esClient, socket) {

    var config = require('../config');
    var fs = require('fs');
    var multer = require('multer');
    var _ = require('underscore');

    var upload = multer({
        dest: config.uploadDir
    });

    //initIndexIfNotExists();
    clearPercolator();

    app.post('/document', upload.single('document'), function (req, res) {
        var createdFileId = -1;
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
                createdFileId = response._id;
                fs.unlink(req.file.path, function (err) {
                    if (err) {
                        throw err;
                    }
                });

                esClient.percolate({
                    index: 'file',
                    type: 'document',
                    id: createdFileId
                }, function (error, response) {
                    _.each(response.matches, function (match) {
                        esClient.get({
                            'id': match._id,
                            'index': 'file',
                            'type': '.percolator',
                            'fields': ['socket', 'term']
                        }, function (err, response) {
                            if (err) {
                                throw err;
                            }
                            var socketId = response.fields.socket;
                            socket.emitSocketId(socketId, 'NEW DOC FOUND: ' + createdFileId + '("'+req.file.originalname+'") for search term "'+ response.fields.term +'"!!!');
                        });
                    });

                });

                res.status(201).end();
            });
        });
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
                                        'title': '*' + search + '*'
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

    function clearPercolator() {
        esClient.search({
            'index': 'file',
            'type': '.percolator'
        }, function (error, response) {
            for (var i in response.hits.hits) {
                var hit = response.hits.hits[i];
                esClient.delete({
                    'index': 'file',
                    'type': '.percolator',
                    'id': hit._id
                }, function (error, response) {});
            }
        });

    }
};